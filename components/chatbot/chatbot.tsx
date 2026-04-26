// components/chatbot/chatbot.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChatbot, type ChatMessage } from "@/hooks/use-chatbot";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

// ── Ícono FAB ─────────────────────────────────────────────────
function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

// ── Typing indicator ──────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-2 w-2 rounded-full bg-muted-foreground"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

// ── Burbuja de mensaje ────────────────────────────────────────
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const isStreaming = message.isStreaming;

  return (
    <motion.div
      className={cn("flex gap-2 max-w-[85%]", isUser && "self-end flex-row-reverse")}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="h-7 w-7 shrink-0 rounded-full bg-accent/20 flex items-center justify-center text-accent font-mono text-xs font-bold mt-0.5">
          DF
        </div>
      )}

      <div className="flex flex-col gap-1">
        {/* Burbuja */}
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
            isUser
              ? "bg-accent text-accent-foreground rounded-br-sm"
              : "bg-card border border-border text-foreground rounded-bl-sm"
          )}
        >
          {isStreaming && message.content === "" ? (
            <TypingDots />
          ) : isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-strong:text-accent prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-0.5 h-4 ml-0.5 bg-accent animate-pulse align-text-bottom" />
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        {!isStreaming && (
          <span className={cn("text-[10px] text-muted-foreground", isUser && "text-right")}>
            {new Intl.DateTimeFormat("es", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(message.timestamp)}
            {isUser && " · ✓✓"}
          </span>
        )}
      </div>

      {/* Avatar usuario */}
      {isUser && (
        <div className="h-7 w-7 shrink-0 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-mono text-xs font-bold mt-0.5">
          TÚ
        </div>
      )}
    </motion.div>
  );
}

// ── Lead capture form ─────────────────────────────────────────
function LeadCapture({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email.includes("@")) return;
    setSubmitted(true);
    onSubmit(email);
  };

  if (submitted) {
    return (
      <div className="mx-4 mb-3 rounded-lg border border-accent/30 bg-accent/5 p-3 text-center">
        <p className="text-xs font-mono text-accent font-semibold">✓ ¡Propuesta en camino!</p>
        <p className="text-xs text-muted-foreground mt-1">Revisa tu bandeja en las próximas horas.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="mx-4 mb-3 rounded-lg border border-border bg-card p-3 space-y-2"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
    >
      <p className="text-xs text-muted-foreground">¿Te enviamos una propuesta personalizada?</p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="tu@email.com"
          className="flex-1 rounded-md border border-border bg-input px-2.5 py-1.5 text-xs font-mono focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
        />
        <button
          onClick={handleSubmit}
          className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground hover:opacity-90 active:scale-95 transition-all"
        >
          Enviar →
        </button>
      </div>
    </motion.div>
  );
}

// ── Componente principal ──────────────────────────────────────
export function Chatbot() {
  const [inputValue, setInputValue] = useState("");
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    isOpen,
    isLoading,
    quickReplies,
    unreadCount,
    bottomRef,
    toggleChat,
    closeChat,
    sendMessage,
    clearHistory,
  } = useChatbot({
    onLeadCaptured: (email) => {
      console.log("Lead captured:", email);
      // Aquí enviarías a tu CRM/API
    },
    onHandoffToHuman: () => {
      window.open("https://wa.me/573001234567", "_blank");
    },
  });

  // Mostrar lead capture cuando hay intención de compra
  useEffect(() => {
    if (messages.length >= 4) {
      const hasHighIntent = messages.some(
        (m) =>
          m.role === "user" &&
          /precio|cuánto|presupuesto|contratar|quiero|necesito/i.test(m.content)
      );
      if (hasHighIntent && !showLeadCapture) {
        setShowLeadCapture(true);
      }
    }
  }, [messages, showLeadCapture]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
    inputRef.current?.focus();
  }, [inputValue, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (text: string) => {
    // Extraer solo el texto sin emoji
    const clean = text.replace(/^[\p{Emoji}\s]+/u, "").trim();
    sendMessage(clean);
  };

  return (
    <>
      {/* ── FAB Button ──────────────────────────────────── */}
      <motion.button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
          "flex items-center justify-center",
          "bg-accent text-accent-foreground",
          "hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        )}
        aria-label="Abrir chat"
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="h-6 w-6"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ChatIcon className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge de no leídos */}
        {!isOpen && unreadCount > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* ── Chat Window ─────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              "fixed bottom-24 right-6 z-50",
              "w-[360px] max-h-[560px]",
              "flex flex-col",
              "rounded-2xl border border-border bg-background shadow-2xl",
              "overflow-hidden"
            )}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                    DF
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">DevForge Assistant</p>
                  <p className="text-[11px] text-muted-foreground">
                    {isLoading ? "Escribiendo..." : "● En línea · Respuesta inmediata"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => window.open("https://wa.me/573001234567", "_blank")}
                  className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-colors text-xs"
                  title="Ir a WhatsApp"
                >
                  💬
                </button>
                <button
                  onClick={clearHistory}
                  className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-colors text-xs"
                  title="Limpiar historial"
                >
                  🗑
                </button>
                <button
                  onClick={closeChat}
                  className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Cerrar chat"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 flex flex-col scroll-smooth">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            {quickReplies.length > 0 && !isLoading && (
              <div className="px-4 pb-2 flex gap-2 flex-wrap shrink-0">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="text-[11px] px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors whitespace-nowrap"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Lead capture */}
            {showLeadCapture && (
              <LeadCapture
                onSubmit={(email) => {
                  setShowLeadCapture(false);
                  sendMessage(`Mi email es ${email}. Quiero recibir la propuesta.`);
                }}
              />
            )}

            {/* Input */}
            <div className="border-t border-border p-3 shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu pregunta..."
                  rows={1}
                  disabled={isLoading}
                  className={cn(
                    "flex-1 resize-none rounded-xl border border-border bg-input px-3 py-2.5",
                    "text-sm font-mono text-foreground placeholder-muted-foreground",
                    "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-all min-h-[40px] max-h-[100px]"
                  )}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className={cn(
                    "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center",
                    "bg-accent text-accent-foreground",
                    "hover:opacity-90 active:scale-95 transition-all",
                    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:opacity-40"
                  )}
                  aria-label="Enviar mensaje"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                Potenciado por Claude AI · Respuesta en segundos
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
