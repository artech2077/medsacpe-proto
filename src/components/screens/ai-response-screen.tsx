"use client";

import {
  type FormEvent,
  startTransition,
  type WheelEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  buildMockAnswer,
  defaultInitialQuestion,
} from "@/components/screens/ai-response-content";

const logoAssets = {
  medscapeAi: "/assets/medscape-ai.svg",
  medscapeMini: "/assets/Medscape-mini.svg",
  promptAnimation: "/assets/prompt-animation.gif",
} as const;

const menuIconSrc = "/assets/kebab-menu.svg";

const uiIcons = {
  download: "/assets/Download.svg",
  history: "/assets/history.svg",
  newChat: "/assets/new-chat.svg",
  settings: "/assets/settings.svg",
  share: "/assets/Share.svg",
} as const;

const composerIcons = {
  scrollDown: "/assets/arrow-down.svg?v=2",
  send: "/assets/arrow-up.svg",
  stop: "/assets/circle-arrow-up.svg",
} as const;

const sidebarHistoryGroups = [
  {
    label: "This month",
    items: ["What are the symptoms of afebrile pneumonia"],
  },
  {
    label: "February 2026",
    items: [
      "What are the treatment options for type 2 diabetes",
      "What are traditional risk factors for CVD?",
      "How does HDL cholesterol affect heart disease risk?",
    ],
  },
  {
    label: "January 2026",
    items: [
      "What are the treatment options for type 2 diabetes",
      "What are traditional risk factors for CVD?",
      "How does HDL cholesterol affect heart disease risk?",
      "What are the treatment options for type 2 diabetes",
      "What are traditional risk factors for CVD?",
    ],
  },
  {
    label: "December 2025",
    items: [
      "What are the treatment options for type 2 diabetes",
      "What are traditional risk factors for CVD?",
      "How does HDL cholesterol affect heart disease risk?",
    ],
  },
] as const;

const PRE_STREAM_DELAY_MS = 1200;
const STREAM_TICK_MS = 18;
const STREAM_CHUNK_SIZE = 4;
const CHAT_BOTTOM_CONTENT_PADDING_PX = 116;
const SCROLL_DOWN_VISIBILITY_THRESHOLD_PX = 8;

type ChatTurnStatus = "preparing" | "streaming" | "complete";

type ChatTurn = {
  answer: string;
  id: number;
  question: string;
  status: ChatTurnStatus;
};

type AiResponseScreenProps = {
  initialQuestion?: string;
};

type AnswerBlock =
  | { text: string; type: "heading" | "paragraph" }
  | { items: string[]; type: "list" };

function MenuIcon() {
  return (
    <img
      src={menuIconSrc}
      alt=""
      aria-hidden="true"
      className="h-5 w-5 object-contain brightness-0"
    />
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.8"
    >
      <path d="M4 4 16 16" />
      <path d="M16 4 4 16" />
    </svg>
  );
}

function OverflowDotsIcon() {
  return (
    <svg viewBox="0 0 4 16" aria-hidden="true" className="h-4 w-4 fill-current">
      <circle cx="2" cy="3" r="1.1" />
      <circle cx="2" cy="8" r="1.1" />
      <circle cx="2" cy="13" r="1.1" />
    </svg>
  );
}

function TopRailAction({ iconSrc, label }: { iconSrc: string; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-full px-2 text-[13px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:bg-[#e8f0fb] md:px-3 md:text-[16px]"
    >
      <img src={iconSrc} alt="" aria-hidden="true" className="h-[18px] w-[18px] object-contain" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}

function SidebarAction({
  iconSrc,
  label,
  onClick,
}: {
  iconSrc: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-[10px] px-2 py-2 text-left text-[15px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:bg-white/55"
    >
      <img src={iconSrc} alt="" aria-hidden="true" className="h-[18px] w-[18px] object-contain" />
      <span>{label}</span>
    </button>
  );
}

function buildAnswerBlocks(answer: string) {
  const lines = answer.split("\n");
  const blocks: AnswerBlock[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length === 0) return;
    blocks.push({ items: currentList, type: "list" });
    currentList = [];
  };

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      flushList();
      continue;
    }

    if (/^-\s+/.test(trimmedLine)) {
      currentList.push(trimmedLine.replace(/^-\s+/, ""));
      continue;
    }

    flushList();

    if (
      /^[A-Z][A-Za-z0-9\s&/]+$/.test(trimmedLine) &&
      trimmedLine.length <= 40 &&
      !trimmedLine.endsWith(".")
    ) {
      blocks.push({ text: trimmedLine, type: "heading" });
      continue;
    }

    blocks.push({ text: trimmedLine, type: "paragraph" });
  }

  flushList();
  return blocks;
}

function StreamedAnswerContent({ answer, isStreaming }: { answer: string; isStreaming: boolean }) {
  const blocks = buildAnswerBlocks(answer);

  return (
    <div className="text-[16px] leading-[1.45] text-[var(--mscp-color-text-body)]">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h2
              key={`${block.type}-${index}`}
              className="mt-8 text-[16px] font-bold text-[#3c454d] first:mt-0"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              key={`${block.type}-${index}`}
              className="mt-5 list-disc space-y-3 pl-6 marker:text-[#252c31]"
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`${block.type}-${index}`} className="mt-5 first:mt-0">
            {block.text}
          </p>
        );
      })}
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
    <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full bg-[#edf5ff] px-4 py-2 text-[14px] leading-[1.35] text-[#4b5a67] md:text-[15px]">
      <span className="inline-flex h-5 w-5 items-center justify-center">
        <img
          src={logoAssets.promptAnimation}
          alt=""
          aria-hidden="true"
          className="h-[18px] w-[18px] object-contain"
        />
      </span>
      <p className="min-w-0 truncate">Assessing evidence and outcomes related to {preview}</p>
    </div>
  );
}

function SendButtonIcon({ generating }: { generating: boolean }) {
  return (
    <img
      src={generating ? composerIcons.stop : composerIcons.send}
      alt=""
      aria-hidden="true"
      className="h-8 w-8 object-contain"
    />
  );
}

export function AiResponseScreen({
  initialQuestion = defaultInitialQuestion,
}: AiResponseScreenProps) {
  const router = useRouter();
  const responseScrollRef = useRef<HTMLDivElement>(null);
  const turnArticleRefs = useRef(new Map<number, HTMLElement>());
  const composerInputRef = useRef<HTMLInputElement>(null);
  const responseDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const responseStreamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeTurnIdRef = useRef<number | null>(null);
  const nextTurnIdRef = useRef(1);
  const startedInitialQuestionRef = useRef<string | null>(null);

  const [composerDraft, setComposerDraft] = useState("");
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([]);
  const [bottomSpacerHeight, setBottomSpacerHeight] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
  const hasComposerDraft = composerDraft.trim().length > 0;
  const isGenerationInProgress = chatTurns.some(
    (turn) => turn.status === "preparing" || turn.status === "streaming",
  );

  const navigate = useCallback(
    (href: string) => {
      startTransition(() => {
        router.push(href);
      });
    },
    [router],
  );

  const clearResponseTimers = useCallback(() => {
    if (responseDelayTimeoutRef.current) {
      clearTimeout(responseDelayTimeoutRef.current);
      responseDelayTimeoutRef.current = null;
    }

    if (responseStreamIntervalRef.current) {
      clearInterval(responseStreamIntervalRef.current);
      responseStreamIntervalRef.current = null;
    }
  }, []);

  const scrollResponseToBottom = useCallback((behavior: ScrollBehavior) => {
    const responseScroll = responseScrollRef.current;
    if (!responseScroll) return;

    responseScroll.scrollTo({
      behavior,
      top: responseScroll.scrollHeight,
    });
  }, []);

  const scrollTurnQuestionToTop = useCallback(
    (turnId: number, behavior: ScrollBehavior) => {
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
        behavior,
        top: Math.max(turnTop - 12, 0),
      });
    },
    [scrollResponseToBottom],
  );

  const reserveBottomSpaceForTurnTop = useCallback((turnId: number) => {
    const responseScroll = responseScrollRef.current;
    const turnArticle = turnArticleRefs.current.get(turnId);
    if (!responseScroll || !turnArticle) return 0;

    const responseRect = responseScroll.getBoundingClientRect();
    const turnRect = turnArticle.getBoundingClientRect();
    const turnTop = turnRect.top - responseRect.top + responseScroll.scrollTop;
    const targetTop = Math.max(turnTop - 12, 0);
    const maxScrollTop = Math.max(responseScroll.scrollHeight - responseScroll.clientHeight, 0);

    return Math.max(targetTop - maxScrollTop + 16, 0);
  }, []);

  const registerTurnArticle = (turnId: number, node: HTMLElement | null) => {
    if (node) {
      turnArticleRefs.current.set(turnId, node);
      return;
    }

    turnArticleRefs.current.delete(turnId);
  };

  const startStreamingTurn = useCallback(
    (
      question: string,
      options: {
        focusComposer?: boolean;
      } = {},
    ) => {
      const trimmedQuestion = question.trim();
      if (!trimmedQuestion) return;

      clearResponseTimers();
      setBottomSpacerHeight(0);

      const newTurnId = nextTurnIdRef.current;
      const answerText = buildMockAnswer(trimmedQuestion);
      nextTurnIdRef.current += 1;
      activeTurnIdRef.current = newTurnId;

      const nextTurn: ChatTurn = {
        answer: "",
        id: newTurnId,
        question: trimmedQuestion,
        status: "preparing",
      };

      setChatTurns((currentTurns): ChatTurn[] => [
        ...currentTurns.map((turn): ChatTurn =>
          turn.status === "complete" ? turn : { ...turn, status: "complete" },
        ),
        nextTurn,
      ]);

      setComposerDraft("");

      if (options.focusComposer !== false) {
        composerInputRef.current?.focus();
      }

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

        setChatTurns((currentTurns): ChatTurn[] =>
          currentTurns.map((turn): ChatTurn =>
            turn.id === newTurnId ? { ...turn, status: "streaming" } : turn,
          ),
        );

        let nextLength = 0;
        responseStreamIntervalRef.current = setInterval(() => {
          if (activeTurnIdRef.current !== newTurnId) {
            clearResponseTimers();
            return;
          }

          nextLength = Math.min(nextLength + STREAM_CHUNK_SIZE, answerText.length);
          const nextAnswer = answerText.slice(0, nextLength);

          setChatTurns((currentTurns): ChatTurn[] =>
            currentTurns.map((turn): ChatTurn =>
              turn.id === newTurnId ? { ...turn, answer: nextAnswer } : turn,
            ),
          );

          if (nextLength >= answerText.length) {
            if (responseStreamIntervalRef.current) {
              clearInterval(responseStreamIntervalRef.current);
              responseStreamIntervalRef.current = null;
            }

            setChatTurns((currentTurns): ChatTurn[] =>
              currentTurns.map((turn): ChatTurn =>
                turn.id === newTurnId ? { ...turn, status: "complete" } : turn,
              ),
            );
            setBottomSpacerHeight(0);
            activeTurnIdRef.current = null;
          }
        }, STREAM_TICK_MS);
      }, PRE_STREAM_DELAY_MS);
    },
    [clearResponseTimers, reserveBottomSpaceForTurnTop, scrollTurnQuestionToTop],
  );

  const submitQuestion = useCallback(
    (question: string, options?: { focusComposer?: boolean }) => {
      setIsSidebarOpen(false);
      startStreamingTurn(question, options);
    },
    [startStreamingTurn],
  );

  useEffect(() => {
    return () => {
      clearResponseTimers();
    };
  }, [clearResponseTimers]);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSidebarOpen]);

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

  useEffect(() => {
    const trimmedInitialQuestion = initialQuestion.trim();
    if (!trimmedInitialQuestion) return;
    if (startedInitialQuestionRef.current === trimmedInitialQuestion) return;

    const frameId = requestAnimationFrame(() => {
      if (startedInitialQuestionRef.current === trimmedInitialQuestion) return;

      startedInitialQuestionRef.current = trimmedInitialQuestion;
      submitQuestion(trimmedInitialQuestion, { focusComposer: false });
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [initialQuestion, submitQuestion]);

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
      behavior: "auto",
      left: event.deltaX * deltaUnit,
      top: event.deltaY * deltaUnit,
    });
  };

  const handleComposerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!composerDraft.trim()) return;
    submitQuestion(composerDraft);
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

  const handleLandingClick = () => {
    setIsSidebarOpen(false);
    navigate("/ai-response");
  };

  const handleHomeClick = () => {
    setIsSidebarOpen(false);
    navigate("/");
  };

  return (
    <main
      className="relative flex h-dvh min-h-0 overflow-hidden bg-[#dce8fb] text-[var(--mscp-color-text-primary)]"
      onWheelCapture={handleWheelCapture}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#d7e6fd_0%,#e9f2ff_34%,#d5e5ff_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[220px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0)_72%)]" />
        <div className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-[rgba(114,166,255,0.14)] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[rgba(6,74,167,0.10)] blur-3xl" />
      </div>

      <section className="relative flex min-h-0 flex-1 p-2 md:p-3">
        <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-[22px] border border-[rgba(109,153,206,0.42)] bg-white shadow-[0_18px_44px_rgba(6,74,167,0.12)]">
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setIsSidebarOpen(false)}
            className={`absolute inset-0 z-30 bg-[rgba(217,230,249,0.66)] transition md:hidden ${
              isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          />

          <div
            className={`hidden shrink-0 transition-[width] duration-300 ease-out md:block ${
              isSidebarOpen ? "w-[244px]" : "w-0"
            }`}
          />

          <aside
            className={`absolute inset-y-0 left-0 z-40 flex w-[244px] flex-col border-r border-[#d6e0ef] bg-[#edf4ff] transition-transform duration-300 ease-out ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between px-4 pb-3 pt-4">
              <button
                type="button"
                onClick={handleHomeClick}
                className="inline-flex items-center gap-2 rounded-full pr-2 text-[14px] font-semibold text-[var(--mscp-color-brand-primary)] transition hover:opacity-80"
              >
                <img
                  src={logoAssets.medscapeMini}
                  alt=""
                  aria-hidden="true"
                  className="h-[18px] w-[18px] object-contain"
                />
                <span>Return to Medscape</span>
              </button>

              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsSidebarOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#495661] transition hover:bg-white/70"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5">
              <div className="flex flex-col gap-1">
                <SidebarAction iconSrc={uiIcons.newChat} label="New Chat" onClick={handleLandingClick} />
                <SidebarAction iconSrc={uiIcons.settings} label="Settings" />
              </div>

              <div className="mt-5 border-t border-[#d7e2f1] pt-4">
                <div className="mb-3 flex items-center gap-2 px-2 text-[15px] font-semibold text-[#28323b]">
                  <img
                    src={uiIcons.history}
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4 object-contain"
                  />
                  <span>History</span>
                </div>

                <div className="space-y-5">
                  {sidebarHistoryGroups.map((group, groupIndex) => (
                    <section key={`${group.label}-${groupIndex}`}>
                      <h2 className="px-2 text-[11px] font-extrabold tracking-[0.04em] text-[#55616c] uppercase">
                        {group.label}
                      </h2>
                      <div className="mt-1 space-y-1">
                        {group.items.map((item, itemIndex) => (
                          <button
                            key={`${group.label}-${itemIndex}-${item}`}
                            type="button"
                            className="flex w-full items-start justify-between gap-3 rounded-[10px] px-2 py-1.5 text-left transition hover:bg-white/55"
                          >
                            <span className="text-[13px] leading-[1.35] text-[var(--mscp-color-brand-primary)]">
                              {item}
                            </span>
                            <span className="pt-0.5 text-[#2c3740]">
                              <OverflowDotsIcon />
                            </span>
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="relative flex min-h-0 flex-1 flex-col">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[108px] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_68%,rgba(255,255,255,0)_100%)]"
            />

            <div className="relative z-20 flex min-h-0 flex-1 flex-col">
              <div className="sticky top-0 z-30">
                <div className="absolute inset-x-0 top-0 h-[104px] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_72%,rgba(255,255,255,0)_100%)]" />
                <div className="relative flex min-h-[72px] items-start justify-between gap-3 px-3 pb-3 pt-3 md:min-h-[78px] md:px-5 md:pb-4 md:pt-3">
                  <button
                    type="button"
                    aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isSidebarOpen}
                    onClick={() => setIsSidebarOpen((current) => !current)}
                    className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#687680] transition hover:bg-white/70"
                  >
                    <MenuIcon />
                  </button>

                  <button
                    type="button"
                    onClick={handleLandingClick}
                    className="absolute left-1/2 top-2.5 -translate-x-1/2 rounded-full px-3 py-2 transition hover:opacity-85 md:top-3"
                    aria-label="Go to new chat"
                  >
                    <img
                      src={logoAssets.medscapeAi}
                      alt="Medscape AI"
                      className="h-[24px] w-auto object-contain md:h-[28px]"
                    />
                  </button>

                  <div className="relative z-10 ml-auto flex items-center gap-0.5 md:gap-1">
                    <TopRailAction iconSrc={uiIcons.share} label="Share" />
                    <TopRailAction iconSrc={uiIcons.download} label="Download" />
                  </div>
                </div>
              </div>

              <div ref={responseScrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="mx-auto w-full max-w-[980px] px-5 pb-[124px] pt-3 md:px-7 md:pb-[136px] md:pt-6">
                  {chatTurns.map((turn) => (
                    <article
                      key={turn.id}
                      ref={(node) => registerTurnArticle(turn.id, node)}
                      className="mx-auto mb-10 max-w-[900px] last:mb-0"
                    >
                      <h1 className="mb-6 text-[24px] leading-[1.24] font-extrabold tracking-[-0.02em] text-[#22282d] md:text-[30px]">
                        {turn.question}
                      </h1>

                      {turn.status === "preparing" ? (
                        <PreparingAnswerNotice question={turn.question} />
                      ) : null}

                      {turn.answer ? (
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
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-[71px] z-10 md:bottom-[76px]">
                <div className="mx-auto flex w-full max-w-[980px] justify-center px-5 md:px-7">
                  <button
                    type="button"
                    aria-label="Scroll to latest"
                    aria-hidden={!showScrollToBottomButton}
                    tabIndex={showScrollToBottomButton ? 0 : -1}
                    disabled={!showScrollToBottomButton}
                    onClick={handleScrollToBottomClick}
                    className={`inline-flex h-8 w-8 items-center justify-center transition-all duration-200 ease-out ${
                      showScrollToBottomButton
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-1 opacity-0"
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

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
                <div className="mx-auto w-full max-w-[980px] px-4 pb-0 md:px-6">
                  <div className="rounded-t-[28px] bg-gradient-to-b from-transparent via-white/82 to-white px-2 pb-[max(env(safe-area-inset-bottom),6px)] pt-3 md:pt-4">
                    <form
                      onSubmit={handleComposerSubmit}
                      className="pointer-events-auto flex min-h-[48px] items-center gap-2 rounded-[999px] border border-[rgba(109,153,206,0.45)] bg-white px-4 py-1 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_22px_rgba(16,24,40,0.06)]"
                      onClick={() => composerInputRef.current?.focus()}
                    >
                      <input
                        ref={composerInputRef}
                        type="text"
                        value={composerDraft}
                        onChange={(event) => setComposerDraft(event.target.value)}
                        placeholder="Ask anything"
                        className="h-8 flex-1 border-0 bg-transparent text-[16px] leading-[20px] text-[#1b2b3a] outline-none placeholder:text-[#93a2ae]"
                      />

                      {isGenerationInProgress ? (
                        <button
                          type="button"
                          aria-label="Stop generating"
                          onClick={handleStopGeneration}
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center"
                        >
                          <SendButtonIcon generating />
                        </button>
                      ) : hasComposerDraft ? (
                        <button
                          type="submit"
                          aria-label="Send"
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center"
                        >
                          <SendButtonIcon generating={false} />
                        </button>
                      ) : null}
                    </form>

                    <p className="pointer-events-auto mt-1 text-center text-[10px] leading-[13px] text-[#647484]">
                      AI may make mistakes. Always apply your clinical judgment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
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
