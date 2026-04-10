"use client";

import { useEffect, useRef, useState } from "react";

const uiIcons = {
  history: "/assets/history.svg",
  medscapeMini: "/assets/Medscape-mini.svg",
  newChat: "/assets/new-chat.svg",
  pencil: "/assets/pencil.svg",
  settings: "/assets/settings.svg",
  trash: "/assets/trash.svg",
} as const;

const rawSidebarHistoryGroups = [
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

type SidebarHistoryItem = {
  id: string;
  question: string;
};

type SidebarHistoryGroup = {
  id: string;
  items: SidebarHistoryItem[];
  label: string;
};

type AiResponseSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onHistoryConversationClick: (question: string) => void;
  onHomeClick: () => void;
  onNewChatClick: () => void;
};

function createInitialSidebarHistoryGroups(): SidebarHistoryGroup[] {
  return rawSidebarHistoryGroups.map((group, groupIndex) => ({
    id: `group-${groupIndex}`,
    items: group.items.map((question, itemIndex) => ({
      id: `group-${groupIndex}-item-${itemIndex}`,
      question,
    })),
    label: group.label,
  }));
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

export function AiResponseSidebar({
  isOpen,
  onClose,
  onHistoryConversationClick,
  onHomeClick,
  onNewChatClick,
}: AiResponseSidebarProps) {
  const [activeMenuItemId, setActiveMenuItemId] = useState<string | null>(null);
  const [historyGroups, setHistoryGroups] = useState<SidebarHistoryGroup[]>(() =>
    createInitialSidebarHistoryGroups(),
  );
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!activeMenuItemId) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && sidebarRef.current?.contains(target)) return;
      setActiveMenuItemId(null);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMenuItemId(null);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [activeMenuItemId]);

  const closeMenus = () => {
    setActiveMenuItemId(null);
  };

  const handleRenameConversation = (itemId: string) => {
    const currentQuestion = historyGroups
      .flatMap((group) => group.items)
      .find((item) => item.id === itemId)?.question;

    if (!currentQuestion) return;

    const nextQuestion = window.prompt("Rename conversation", currentQuestion)?.trim();
    if (!nextQuestion) return;

    setHistoryGroups((currentGroups) =>
      currentGroups.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          item.id === itemId ? { ...item, question: nextQuestion } : item,
        ),
      })),
    );
    setActiveMenuItemId(null);
  };

  const handleDeleteConversation = (itemId: string) => {
    setHistoryGroups((currentGroups) =>
      currentGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.id !== itemId),
        }))
        .filter((group) => group.items.length > 0),
    );
    setActiveMenuItemId(null);
  };

  return (
    <aside
      ref={sidebarRef}
      data-ai-response-sidebar="true"
      className={`absolute inset-y-0 left-0 z-40 flex w-[272px] flex-col border-r border-[#d6e0ef] bg-[#edf4ff] transition-transform duration-300 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-4 pb-3 pt-4">
        <button
          type="button"
          onClick={() => {
            closeMenus();
            onHomeClick();
          }}
          className="inline-flex items-center gap-2 rounded-full pr-2 text-[14px] font-semibold text-[var(--mscp-color-brand-primary)] transition"
        >
          <img
            src={uiIcons.medscapeMini}
            alt=""
            aria-hidden="true"
            className="h-[18px] w-[18px] object-contain"
          />
          <span>Return to Medscape</span>
        </button>

        <button
          type="button"
          aria-label="Close menu"
          onClick={() => {
            closeMenus();
            onClose();
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#495661] transition hover:bg-white/70"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-5">
        <div className="flex flex-col gap-1">
          <SidebarAction
            iconSrc={uiIcons.newChat}
            label="New Chat"
            onClick={() => {
              closeMenus();
              onNewChatClick();
            }}
          />
          <SidebarAction iconSrc={uiIcons.settings} label="Settings" />
        </div>

        <div className="mt-5 border-t border-[#d7e2f1] pt-4">
          <div className="mb-3 flex items-center gap-2 px-2 text-[15px] font-semibold text-[#28323b]">
            <img src={uiIcons.history} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
            <span>History</span>
          </div>

          <div className="space-y-5">
            {historyGroups.map((group) => (
              <section key={group.id}>
                <h2 className="px-2 text-[11px] font-extrabold tracking-[0.04em] text-[#55616c] uppercase">
                  {group.label}
                </h2>
                <div className="mt-1 space-y-1">
                  {group.items.map((item) => {
                    const isMenuOpen = activeMenuItemId === item.id;

                    return (
                      <div key={item.id} className="group relative">
                        <div className="flex items-start gap-3 rounded-[10px] px-2 py-1.5 transition hover:bg-white/55">
                          <button
                            type="button"
                            onClick={() => {
                              closeMenus();
                              onHistoryConversationClick(item.question);
                            }}
                            className="flex-1 text-left text-[13px] leading-[1.35] text-[var(--mscp-color-brand-primary)]"
                          >
                            {item.question}
                          </button>

                          <button
                            type="button"
                            aria-label="Conversation actions"
                            aria-expanded={isMenuOpen}
                            onClick={(event) => {
                              event.stopPropagation();
                              setActiveMenuItemId((current) => (current === item.id ? null : item.id));
                            }}
                            className={`rounded-[10px] border p-2 text-[#2c3740] transition ${
                              isMenuOpen
                                ? "border-[#0053d6] bg-white text-[#0d57c6] shadow-[0_0_0_2px_rgba(0,83,214,0.12)] opacity-100"
                                : "border-transparent bg-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                            }`}
                          >
                            <OverflowDotsIcon />
                          </button>
                        </div>

                        {isMenuOpen ? (
                          <div className="absolute right-[24px] top-9 z-10 min-w-[176px] rounded-[8px] bg-white p-1.5 shadow-[0_10px_24px_rgba(16,24,40,0.16)]">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleRenameConversation(item.id);
                              }}
                              className="flex w-full items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-left text-[15px] font-medium text-[#0d57c6] transition hover:bg-[#f4f8ff]"
                            >
                              <img
                                src={uiIcons.pencil}
                                alt=""
                                aria-hidden="true"
                                className="h-5 w-5 object-contain"
                              />
                              Rename
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteConversation(item.id);
                              }}
                              className="flex w-full items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-left text-[15px] font-medium text-[#0d57c6] transition hover:bg-[#f4f8ff]"
                            >
                              <img
                                src={uiIcons.trash}
                                alt=""
                                aria-hidden="true"
                                className="h-5 w-5 object-contain"
                              />
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
