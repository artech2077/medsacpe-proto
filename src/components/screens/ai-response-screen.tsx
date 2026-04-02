"use client";

import { type FormEvent, type WheelEvent, useEffect, useRef, useState } from "react";

const logoAssets = {
  medscapeLogo: "/assets/logo-medscape.svg",
  emblem: "/assets/emblem.svg",
  promptAnimation: "/assets/prompt-animation.gif",
} as const;

const uiIcons = {
  avatar: "/assets/avatar.svg",
  history: "/assets/history.svg",
  invitations: "/assets/invitations.svg",
  newChat: "/assets/new-chat.svg",
  search: "/assets/search.svg",
} as const;

const composerIcons = {
  send: "/assets/arrow-up.svg",
  stop: "/assets/circle-arrow-up.svg",
  scrollDown: "/assets/arrow-down.svg?v=2",
} as const;

const initialQuestion =
  "What is the recommended dosing regimen for vitamin D and calcium in patients with osteoporosis?";

const calciumIntake = [
  "Younger adults (age 19-50 years): 1,000 mg elemental calcium daily.",
  "Women >= 51 years and men >= 71 years: 1,200 mg elemental calcium daily.",
  "Men age 51-70 years: 1,000 mg elemental calcium daily.",
  "Upper intake level for older adults: 2,000 mg/day to avoid potential adverse effects [1].",
];

const calciumSupplements = [
  "Calcium carbonate (40% elemental calcium): first-line; better absorbed with meals and requires fewer tablets [1].",
  "Calcium citrate (21% elemental calcium): better absorbed fasting; useful in achlorhydria or on acid-suppressing therapy [1].",
];

const vitaminDIntake = [
  "Adults age 51-70 years: 600 IU (15 mcg) daily.",
  "Adults > 70 years: 800 IU (20 mcg) daily.",
  "Minimum requirement in osteoporosis: 800 IU cholecalciferol daily; many patients require higher doses to maintain serum 25-hydroxyvitamin D >= 32 ng/mL [1].",
  "Recommended upper level: 4,000 IU/day.",
];

const combinedSupplements = [
  "Age 19-50 years: 1,000 mg calcium/600 IU vitamin D daily.",
  "Men >= 51-70 years: 1,000 mg/600 IU daily; men >= 70 years: 1,200 mg/800 IU daily.",
  "Women >= 51 years: 1,200 mg calcium/600 IU vitamin D daily.",
];

const PRE_STREAM_DELAY_MS = 5000;
const STREAM_TICK_MS = 18;
const STREAM_CHUNK_SIZE = 4;
const CHAT_BOTTOM_CONTENT_PADDING_PX = 104;
const SCROLL_DOWN_VISIBILITY_THRESHOLD_PX = 8;

const mockStreamingAnswer = [
  "Patients with osteoporosis should maintain adequate daily intakes of elemental calcium and vitamin D, preferably through diet but supplemented as needed.",
  "",
  "Calcium Intake",
  ...calciumIntake.map((item) => `- ${item}`),
  "",
  "Common oral supplements:",
  ...calciumSupplements.map((item) => `- ${item}`),
  "",
  "Typical supplementation dosing (combination products, e.g., Caltrate, Os-Cal):",
  "- 1-2 caplets or tablets twice daily with or without food, titrated to achieve the elemental calcium goal [2].",
  "",
  "Vitamin D Intake",
  ...vitaminDIntake.map((item) => `- ${item}`),
  "",
  "Oral formulations (Drisdol, Calciferol):",
  "- Daily prophylaxis/treatment in patients > 50 years: 800-1,000 IU PO once daily with calcium supplements [3].",
  "",
  "Combined Calcium and Vitamin D Supplements",
  "Preferred in individuals unable to meet targets through diet:",
  ...combinedSupplements.map((item) => `- ${item}`),
  "Administration: take with food to optimize calcium carbonate absorption [2].",
].join("\n");

type ChatTurnStatus = "preparing" | "streaming" | "complete";

type ChatTurnMode = "rich" | "streamed";

type ChatTurn = {
  answer: string;
  id: number;
  mode: ChatTurnMode;
  question: string;
  status: ChatTurnStatus;
};

const initialTurn: ChatTurn = {
  answer: mockStreamingAnswer,
  id: 0,
  mode: "rich",
  question: initialQuestion,
  status: "complete",
};

function HeaderNavItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      className="relative h-[56px] px-1 text-[15px] leading-[18px] font-semibold text-[var(--mscp-color-text-tertiary)]"
    >
      <span className="inline-flex h-full items-center">{label}</span>
      {active ? (
        <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[var(--mscp-color-brand-primary)]" />
      ) : null}
    </button>
  );
}

type AppIconName = "search" | "invitations" | "globe" | "profile" | "history" | "newChat";

function AppIcon({
  name,
  className,
  alt = "",
  white = false,
}: {
  name: AppIconName;
  className: string;
  alt?: string;
  white?: boolean;
}) {
  const iconSrc = {
    history: uiIcons.history,
    invitations: uiIcons.invitations,
    newChat: uiIcons.newChat,
    profile: uiIcons.avatar,
    search: uiIcons.search,
  }[name];

  if (iconSrc) {
    return (
      <img
        alt={alt}
        src={iconSrc}
        aria-hidden={alt ? undefined : true}
        className={`${className}${white ? " brightness-0 invert" : ""}`}
      />
    );
  }

  return (
    <span className={className} role={alt ? "img" : undefined} aria-hidden={alt ? undefined : true}>
      {name === "globe" ? (
        <svg
          viewBox="0 0 20 20"
          className="h-full w-full"
          fill="none"
          stroke={white ? "#ffffff" : "currentColor"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
        >
          <circle cx="10" cy="10" r="7" />
          <path d="M3.7 10h12.6M10 3c1.8 1.8 2.8 4.3 2.8 7s-1 5.2-2.8 7M10 3c-1.8 1.8-2.8 4.3-2.8 7s1 5.2 2.8 7" />
        </svg>
      ) : null}
    </span>
  );
}

function FigmaChevron({
  className = "",
  direction = "down",
}: {
  className?: string;
  direction?: "down" | "up";
}) {
  const rotate = direction === "up" ? "rotate-180" : "";

  return (
    <span className={`inline-flex h-4 w-4 items-center justify-center ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 10 5.29289"
        className={`block ${rotate}`}
        style={{ width: "10px", height: "5.29px" }}
        fill="currentColor"
      >
        <path d="M0.146447 0.146447C0.341709 -0.0488155 0.658291 -0.0488155 0.853553 0.146447L5 4.29289L9.14645 0.146447C9.34171 -0.0488155 9.65829 -0.0488155 9.85355 0.146447C10.0488 0.341709 10.0488 0.658291 9.85355 0.853553L5.70711 5C5.31658 5.39052 4.68342 5.39053 4.29289 5L0.146447 0.853553C-0.0488155 0.658291 -0.0488155 0.341709 0.146447 0.146447Z" />
      </svg>
    </span>
  );
}

function TopActionLink({
  kind,
  label,
  iconOnly = false,
}: {
  kind: "history" | "new";
  label: string;
  iconOnly?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex items-center whitespace-nowrap text-[var(--mscp-color-brand-primary)] ${
        iconOnly
          ? "h-8 w-8 justify-center rounded-full"
          : "gap-1.5 text-[16px] leading-[19px] font-semibold"
      }`}
    >
      {kind === "history" ? (
        <AppIcon name="history" className="h-4 w-4 object-contain" />
      ) : (
        <AppIcon name="newChat" className="h-4 w-4 object-contain" />
      )}
      {!iconOnly ? <span className="whitespace-nowrap">{label}</span> : null}
    </button>
  );
}

function CircleArrow() {
  return (
    <img src={composerIcons.send} alt="" aria-hidden="true" className="h-8 w-8 object-contain" />
  );
}

function StopSquare() {
  return (
    <img src={composerIcons.stop} alt="" aria-hidden="true" className="h-8 w-8 object-contain" />
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 text-[15px] leading-[1.42] text-[var(--mscp-color-text-body)] md:text-[16px]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function InitialAnswerContent() {
  return (
    <>
      <p className="mb-7 text-[15px] leading-[1.45] text-[var(--mscp-color-text-body)] md:text-[16px]">
        Patients with osteoporosis should maintain adequate daily intakes of elemental calcium and vitamin D,
        preferably through diet but supplemented as needed.
      </p>

      <section className="mb-7">
        <h2 className="mb-1.5 text-[15px] leading-[1.3] font-semibold text-black md:text-[16px]">Calcium Intake</h2>
        <BulletList items={calciumIntake} />
      </section>

      <section className="mb-7 text-[15px] leading-[1.42] text-[var(--mscp-color-text-body)] md:text-[16px]">
        <p className="mb-1.5">Common oral supplements:</p>
        <p>- {calciumSupplements[0]}</p>
        <p>- {calciumSupplements[1]}</p>
      </section>

      <section className="mb-7 text-[15px] leading-[1.42] text-[var(--mscp-color-text-body)] md:text-[16px]">
        <p className="mb-1.5">Typical supplementation dosing (combination products, e.g., Caltrate, Os-Cal):</p>
        <ul className="list-disc pl-5">
          <li>1-2 caplets or tablets twice daily with or without food, titrated to achieve the elemental calcium goal [2].</li>
        </ul>
      </section>

      <section className="mb-7">
        <h2 className="mb-1.5 text-[15px] leading-[1.3] font-semibold text-black md:text-[16px]">Vitamin D Intake</h2>
        <BulletList items={vitaminDIntake} />
      </section>

      <section className="mb-7 text-[15px] leading-[1.42] text-[var(--mscp-color-text-body)] md:text-[16px]">
        <p className="mb-1.5">Oral formulations (Drisdol, Calciferol):</p>
        <p>- Daily prophylaxis/treatment in patients &gt; 50 years: 800-1,000 IU PO once daily with calcium supplements [3].</p>
      </section>

      <section className="text-[15px] leading-[1.42] text-[var(--mscp-color-text-body)] md:text-[16px]">
        <h2 className="mb-1.5 text-[15px] leading-[1.3] font-semibold text-black md:text-[16px]">
          Combined Calcium and Vitamin D Supplements
        </h2>
        <p className="mb-1.5">Preferred in individuals unable to meet targets through diet:</p>
        <BulletList items={combinedSupplements} />
        <p className="mt-1.5">Administration: take with food to optimize calcium carbonate absorption [2].</p>
      </section>
    </>
  );
}

function StreamedAnswerContent({ answer, isStreaming }: { answer: string; isStreaming: boolean }) {
  return (
    <div className="whitespace-pre-wrap text-[15px] leading-[1.45] text-[var(--mscp-color-text-body)] md:text-[16px]">
      {answer}
      {isStreaming ? (
        <span aria-hidden="true" className="mscp-stream-cursor ml-[1px] align-baseline">
          |
        </span>
      ) : null}
    </div>
  );
}

function PreparingAnswerNotice({ question }: { question: string }) {
  const preview = question.length > 84 ? `${question.slice(0, 84)}...` : question;

  return (
    <div className="mb-7 flex items-center gap-2.5 text-[15px] leading-[1.42] text-[var(--mscp-color-text-body)] md:text-[16px]">
      <span className="inline-flex h-5 w-5 items-center justify-center">
        <img
          src={logoAssets.promptAnimation}
          alt=""
          aria-hidden="true"
          className="h-[18px] w-[18px] object-contain"
        />
      </span>
      <p>Assessing evidence and outcomes related to {preview}</p>
    </div>
  );
}

export function AiResponseScreen() {
  const responseScrollRef = useRef<HTMLDivElement>(null);
  const turnArticleRefs = useRef(new Map<number, HTMLElement>());
  const composerInputRef = useRef<HTMLInputElement>(null);
  const responseDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const responseStreamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeTurnIdRef = useRef<number | null>(null);
  const nextTurnIdRef = useRef(1);

  const [composerDraft, setComposerDraft] = useState("");
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([initialTurn]);
  const [bottomSpacerHeight, setBottomSpacerHeight] = useState(0);
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
  const hasComposerDraft = composerDraft.trim().length > 0;
  const isGenerationInProgress = chatTurns.some(
    (turn) => turn.status === "preparing" || turn.status === "streaming",
  );

  const clearResponseTimers = () => {
    if (responseDelayTimeoutRef.current) {
      clearTimeout(responseDelayTimeoutRef.current);
      responseDelayTimeoutRef.current = null;
    }

    if (responseStreamIntervalRef.current) {
      clearInterval(responseStreamIntervalRef.current);
      responseStreamIntervalRef.current = null;
    }
  };

  const scrollResponseToBottom = (behavior: ScrollBehavior) => {
    const responseScroll = responseScrollRef.current;
    if (!responseScroll) return;

    responseScroll.scrollTo({
      top: responseScroll.scrollHeight,
      behavior,
    });
  };

  const scrollTurnQuestionToTop = (turnId: number, behavior: ScrollBehavior) => {
    const responseScroll = responseScrollRef.current;
    const turnArticle = turnArticleRefs.current.get(turnId);
    if (!responseScroll || !turnArticle) {
      scrollResponseToBottom(behavior);
      return;
    }

    const responseRect = responseScroll.getBoundingClientRect();
    const turnRect = turnArticle.getBoundingClientRect();
    const turnTop = turnRect.top - responseRect.top + responseScroll.scrollTop;

    responseScroll.scrollTo({
      top: Math.max(turnTop - 8, 0),
      behavior,
    });
  };

  const reserveBottomSpaceForTurnTop = (turnId: number) => {
    const responseScroll = responseScrollRef.current;
    const turnArticle = turnArticleRefs.current.get(turnId);
    if (!responseScroll || !turnArticle) return 0;

    const responseRect = responseScroll.getBoundingClientRect();
    const turnRect = turnArticle.getBoundingClientRect();
    const turnTop = turnRect.top - responseRect.top + responseScroll.scrollTop;
    const targetTop = Math.max(turnTop - 8, 0);
    const maxScrollTop = Math.max(responseScroll.scrollHeight - responseScroll.clientHeight, 0);

    return Math.max(targetTop - maxScrollTop + 16, 0);
  };

  const registerTurnArticle = (turnId: number, node: HTMLElement | null) => {
    if (node) {
      turnArticleRefs.current.set(turnId, node);
      return;
    }

    turnArticleRefs.current.delete(turnId);
  };

  useEffect(() => {
    return () => {
      clearResponseTimers();
    };
  }, []);

  useEffect(() => {
    const responseScroll = responseScrollRef.current;
    if (!responseScroll) return;

    const syncScrollToBottomVisibility = () => {
      const rawHiddenBottom =
        responseScroll.scrollHeight - responseScroll.clientHeight - responseScroll.scrollTop;
      const effectiveHiddenBottom =
        rawHiddenBottom - CHAT_BOTTOM_CONTENT_PADDING_PX - bottomSpacerHeight;
      setShowScrollToBottomButton(effectiveHiddenBottom > SCROLL_DOWN_VISIBILITY_THRESHOLD_PX);
    };

    syncScrollToBottomVisibility();
    responseScroll.addEventListener("scroll", syncScrollToBottomVisibility, { passive: true });

    const resizeObserver = new ResizeObserver(syncScrollToBottomVisibility);
    resizeObserver.observe(responseScroll);

    const scrollContent = responseScroll.firstElementChild;
    if (scrollContent instanceof HTMLElement) {
      resizeObserver.observe(scrollContent);
    }

    return () => {
      responseScroll.removeEventListener("scroll", syncScrollToBottomVisibility);
      resizeObserver.disconnect();
    };
  }, [bottomSpacerHeight]);

  const handleWheelCapture = (event: WheelEvent<HTMLElement>) => {
    if (event.ctrlKey) return;

    const responseScroll = responseScrollRef.current;
    if (!responseScroll) return;

    const target = event.target as Node | null;
    if (target && responseScroll.contains(target)) return;

    const deltaUnit =
      event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? responseScroll.clientHeight : 1;

    if (event.deltaX === 0 && event.deltaY === 0) return;

    event.preventDefault();
    responseScroll.scrollBy({
      left: event.deltaX * deltaUnit,
      top: event.deltaY * deltaUnit,
      behavior: "auto",
    });
  };

  const handleComposerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuestion = composerDraft.trim();
    if (!trimmedQuestion) return;

    clearResponseTimers();
    setBottomSpacerHeight(0);

    const newTurnId = nextTurnIdRef.current;
    nextTurnIdRef.current += 1;
    activeTurnIdRef.current = newTurnId;

    setChatTurns((currentTurns) => [
      ...currentTurns.map((turn) => (turn.status === "complete" ? turn : { ...turn, status: "complete" })),
      {
        answer: "",
        id: newTurnId,
        mode: "streamed",
        question: trimmedQuestion,
        status: "preparing",
      },
    ]);

    setComposerDraft("");
    composerInputRef.current?.focus();
    requestAnimationFrame(() => {
      const neededBottomSpace = reserveBottomSpaceForTurnTop(newTurnId);
      if (neededBottomSpace > 0) {
        setBottomSpacerHeight((current) => Math.max(current, neededBottomSpace));
        requestAnimationFrame(() => {
          scrollTurnQuestionToTop(newTurnId, "auto");
        });
        return;
      }

      scrollTurnQuestionToTop(newTurnId, "auto");
    });

    responseDelayTimeoutRef.current = setTimeout(() => {
      if (activeTurnIdRef.current !== newTurnId) return;

      setChatTurns((currentTurns) =>
        currentTurns.map((turn) =>
          turn.id === newTurnId ? { ...turn, status: "streaming" } : turn,
        ),
      );

      let nextLength = 0;
      responseStreamIntervalRef.current = setInterval(() => {
        if (activeTurnIdRef.current !== newTurnId) {
          clearResponseTimers();
          return;
        }

        nextLength = Math.min(nextLength + STREAM_CHUNK_SIZE, mockStreamingAnswer.length);
        const nextAnswer = mockStreamingAnswer.slice(0, nextLength);

        setChatTurns((currentTurns) =>
          currentTurns.map((turn) =>
            turn.id === newTurnId ? { ...turn, answer: nextAnswer } : turn,
          ),
        );

        if (nextLength >= mockStreamingAnswer.length) {
          if (responseStreamIntervalRef.current) {
            clearInterval(responseStreamIntervalRef.current);
            responseStreamIntervalRef.current = null;
          }

          setChatTurns((currentTurns) =>
            currentTurns.map((turn) =>
              turn.id === newTurnId ? { ...turn, status: "complete" } : turn,
            ),
          );
          setBottomSpacerHeight(0);
          activeTurnIdRef.current = null;
        }
      }, STREAM_TICK_MS);
    }, PRE_STREAM_DELAY_MS);
  };

  const handleStopGeneration = () => {
    const activeTurnId = activeTurnIdRef.current;
    if (activeTurnId === null) return;

    clearResponseTimers();
    activeTurnIdRef.current = null;
    setBottomSpacerHeight(0);
    setChatTurns((currentTurns) =>
      currentTurns.map((turn) =>
        turn.id === activeTurnId && turn.status !== "complete"
          ? { ...turn, status: "complete" }
          : turn,
      ),
    );
  };

  const handleScrollToBottomClick = () => {
    scrollResponseToBottom("smooth");
  };

  return (
    <main
      className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[var(--mscp-color-bg-section)] text-[var(--mscp-color-text-primary)]"
      onWheelCapture={handleWheelCapture}
    >
      <header className="sticky top-0 z-40 shrink-0 border-b border-[var(--mscp-color-border-primary)] bg-white">
        <div className="mx-auto flex h-[56px] w-full max-w-[1480px] items-center justify-between px-3">
          <img
            alt="Medscape"
            src={logoAssets.medscapeLogo}
            className="h-[28px] w-[130px] object-contain object-left"
          />

          <nav className="hidden items-center gap-4 lg:flex">
            <HeaderNavItem label="For You" />
            <HeaderNavItem label="News & Perspective" active />
            <HeaderNavItem label="Tools & Reference" />
            <HeaderNavItem label="CME/CE" />
            <div className="flex items-center gap-1">
              <HeaderNavItem label="More" />
              <FigmaChevron />
            </div>
          </nav>

          <div className="flex items-center gap-4 text-[15px] leading-[18px] font-semibold text-[var(--mscp-color-text-tertiary)]">
            <AppIcon name="search" className="h-4 w-4 object-contain" />
            <div className="relative hidden items-center md:flex">
              <AppIcon name="invitations" className="h-4 w-4 object-contain" />
              <span className="absolute -right-1 top-0 h-1.5 w-1.5 rounded-full bg-[#9b1627]" />
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <AppIcon name="globe" className="h-4 w-4 object-contain" />
              <span>EN</span>
            </div>
            <AppIcon name="profile" className="h-4 w-4 object-contain" />
          </div>
        </div>
      </header>

      <section className="min-h-0 flex-1 overflow-hidden px-[4px] pb-[10px] pt-[10px] md:px-[8px]">
        <div className="mx-auto h-full min-h-0 w-full rounded-[18px] border border-[rgba(6,74,167,0.05)] bg-white shadow-[0_2px_16px_rgba(6,74,167,0.08)] md:min-h-[620px]">
          <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[18px]">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden h-9 bg-gradient-to-b from-white via-white/92 to-transparent md:block" />
            <div className="pointer-events-none absolute left-8 top-3 z-30 hidden md:block">
              <div className="pointer-events-auto flex items-center gap-6">
                <TopActionLink kind="history" label="History" />
                <TopActionLink kind="new" label="New Chat" />
              </div>
            </div>

            <div ref={responseScrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="mx-auto w-full max-w-[1380px] px-3 md:px-6">
                <div className="grid grid-cols-1 gap-4 pb-[104px] pt-0 md:grid-cols-[minmax(180px,1fr)_minmax(0,920px)_minmax(180px,1fr)] md:pt-3">
                  <div className="hidden md:block" />
                  <div>
                    <div className="sticky top-0 z-20 mb-3 flex items-center justify-end gap-3 bg-gradient-to-b from-white via-white/94 to-transparent px-1 pb-3 pt-2 md:hidden">
                      <TopActionLink kind="history" label="History" iconOnly />
                      <TopActionLink kind="new" label="New Chat" iconOnly />
                    </div>
                    <div className="mb-5 mt-3 flex items-center justify-center md:mt-9">
                      <div className="flex items-center gap-2">
                        <img src={logoAssets.emblem} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
                        <span className="text-[18px] leading-[22px] font-semibold">Medscape AI</span>
                      </div>
                    </div>
                    {chatTurns.map((turn) => (
                      <article
                        key={turn.id}
                        ref={(node) => registerTurnArticle(turn.id, node)}
                        className="mb-12 last:mb-0"
                      >
                        <h1 className="mb-6 text-[26px] leading-[1.28] font-semibold tracking-[-0.01em] text-black md:text-[28px]">
                          {turn.question}
                        </h1>

                        {turn.status === "preparing" ? (
                          <PreparingAnswerNotice question={turn.question} />
                        ) : null}

                        {turn.mode === "rich" ? <InitialAnswerContent /> : null}

                        {turn.mode === "streamed" && turn.answer ? (
                          <StreamedAnswerContent
                            answer={turn.answer}
                            isStreaming={turn.status === "streaming"}
                          />
                        ) : null}
                      </article>
                    ))}
                    {bottomSpacerHeight > 0 ? (
                      <div aria-hidden="true" style={{ height: `${bottomSpacerHeight}px` }} />
                    ) : null}
                  </div>
                  <div className="hidden md:block" />
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-[82px] z-20 bg-transparent">
              <div className="relative mx-auto w-full max-w-[980px] px-2 md:px-4">
                <div className="flex justify-center">
                  <button
                    type="button"
                    aria-label="Scroll to latest"
                    aria-hidden={!showScrollToBottomButton}
                    tabIndex={showScrollToBottomButton ? 0 : -1}
                    disabled={!showScrollToBottomButton}
                    onClick={handleScrollToBottomClick}
                    className={`inline-flex h-8 w-8 items-center justify-center transition-all duration-200 ease-out ${
                      showScrollToBottomButton
                        ? "translate-y-0 opacity-100 pointer-events-auto"
                        : "translate-y-1 opacity-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={composerIcons.scrollDown}
                      alt=""
                      aria-hidden="true"
                      className="h-8 w-8 object-contain"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-transparent pt-1">
              <div className="relative mx-auto w-full max-w-[980px] px-2 md:px-4">
                <div className="rounded-t-[22px] bg-gradient-to-b from-transparent via-white/72 to-white px-2 pb-2 pt-3">
                  <form
                    onSubmit={handleComposerSubmit}
                    className="pointer-events-auto flex min-h-[48px] items-center gap-2 rounded-[999px] border border-[rgba(109,153,206,0.45)] bg-white pl-4 pr-2 py-1 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_4px_14px_rgba(16,24,40,0.04)]"
                    onClick={() => composerInputRef.current?.focus()}
                  >
                    <input
                      ref={composerInputRef}
                      type="text"
                      value={composerDraft}
                      onChange={(event) => setComposerDraft(event.target.value)}
                      placeholder="Ask anything"
                      className="h-8 flex-1 border-0 bg-transparent text-[16px] leading-[20px] text-[#1b2b3a] outline-none placeholder:text-[#6d8397]"
                    />

                    {isGenerationInProgress ? (
                      <button
                        type="button"
                        aria-label="Stop generating"
                        onClick={handleStopGeneration}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center"
                      >
                        <StopSquare />
                      </button>
                    ) : hasComposerDraft ? (
                      <button
                        type="submit"
                        aria-label="Send"
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center"
                      >
                        <CircleArrow />
                      </button>
                    ) : null}
                  </form>

                  <p className="pointer-events-auto mt-2 text-center text-[10px] leading-[13px] text-[#647484]">
                    AI may make mistakes. Always apply your clinical judgment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes mscp-stream-cursor-blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }

        .mscp-stream-cursor {
          animation: mscp-stream-cursor-blink 1s step-end infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .mscp-stream-cursor {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
