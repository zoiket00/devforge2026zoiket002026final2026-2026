// hooks/use-chatbot.ts
// ┌─────────────────────────────────────────────────────────────┐
// │  CHATBOT HOOK - Estado, streaming, persistence, analytics   │
// └─────────────────────────────────────────────────────────────┘

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { QUICK_REPLIES_BY_CONTEXT } from "@/lib/chat/knowledge-base";
import { generateSecureToken } from "@/lib/security/crypto";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface UseChatbotOptions {
  onLeadCaptured?: (email: string) => void;
  onHandoffToHuman?: () => void;
}

const STORAGE_KEY = "devforge_chat_history";
const SESSION_KEY = "devforge_session_id";
const MAX_STORED = 50;

export function useChatbot(options: UseChatbotOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>(
    QUICK_REPLIES_BY_CONTEXT.greeting
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [sessionId] = useState(() => {
    if (typeof window === "undefined") return generateSecureToken(8);
    return (
      sessionStorage.getItem(SESSION_KEY) ||
      (() => {
        const id = generateSecureToken(8);
        sessionStorage.setItem(SESSION_KEY, id);
        return id;
      })()
    );
  });

  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const hasProactiveFired = useRef(false);

  // ── Cargar historial de localStorage ──────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ChatMessage[] = JSON.parse(stored);
        const recent = parsed
          .slice(-MAX_STORED)
          .map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
        setMessages(recent);
      } else {
        // Mensaje de bienvenida
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content:
              "¡Hola! Soy el asistente de **DevForge**. Puedo ayudarte con cotizaciones, servicios, tecnologías y más. ¿En qué puedo ayudarte?",
            timestamp: new Date(),
          },
        ]);
      }
    } catch {
      // Si localStorage falla (modo privado, etc.), continuar sin historial
    }
  }, []);

  // ── Guardar historial en localStorage ─────────────────────
  useEffect(() => {
    if (messages.length === 0) return;
    try {
      const toStore = messages
        .filter((m) => !m.isStreaming)
        .slice(-MAX_STORED);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch {
      // Silencioso si localStorage está lleno
    }
  }, [messages]);

  // ── Auto-scroll ───────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Contador de no leídos ─────────────────────────────────
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "assistant" && !lastMsg.isStreaming) {
        setUnreadCount((n) => n + 1);
      }
    }
  }, [messages, isOpen]);

  // ── Proactive trigger (a los 30 segundos) ─────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasProactiveFired.current && !isOpen && messages.length <= 1) {
        hasProactiveFired.current = true;
        setUnreadCount(1);
        setMessages((prev) => [
          ...prev,
          {
            id: `proactive-${Date.now()}`,
            role: "assistant",
            content:
              "👋 ¿Tienes algún proyecto en mente? Puedo darte una cotización preliminar en segundos.",
            timestamp: new Date(),
          },
        ]);
      }
    }, 30_000);

    return () => clearTimeout(timer);
  }, [isOpen, messages.length]);

  // ── Abrir / cerrar chat ───────────────────────────────────
  const openChat = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setUnreadCount(0);
      return !prev;
    });
  }, []);

  // ── Enviar mensaje ────────────────────────────────────────
  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      // Cancelar stream anterior si existe
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      // Detectar handoff a humano
      const handoffKeywords = ["hablar con humano", "agente humano", "whatsapp", "llamar", "teléfono"];
      if (handoffKeywords.some((k) => trimmed.toLowerCase().includes(k))) {
        options.onHandoffToHuman?.();
      }

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      const streamingId = `assistant-${Date.now()}`;
      const streamingMsg: ChatMessage = {
        id: streamingId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, streamingMsg]);
      setIsLoading(true);
      setQuickReplies([]);

      try {
        // Preparar historial para API (sin el mensaje streaming)
        const apiMessages = [
          ...messages.filter((m) => !m.isStreaming).slice(-10),
          userMsg,
        ].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            sessionId,
          }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        // ── Procesar stream SSE ─────────────────────────
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";
        let lastContext = "greeting";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "delta") {
                fullContent += data.text;
                lastContext = data.context || "greeting";

                // Actualizar burbuja en tiempo real
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === streamingId
                      ? { ...m, content: fullContent }
                      : m
                  )
                );
              }

              if (data.type === "done") {
                // Finalizar streaming
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === streamingId
                      ? { ...m, content: fullContent, isStreaming: false }
                      : m
                  )
                );

                // Actualizar quick replies según contexto
                const replies =
                  QUICK_REPLIES_BY_CONTEXT[lastContext] ||
                  QUICK_REPLIES_BY_CONTEXT.greeting;
                setQuickReplies(replies);
              }

              if (data.type === "error") {
                throw new Error(data.error);
              }
            } catch {
              // Ignorar líneas mal formadas
            }
          }
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") return;

        // Mensaje de error amigable
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingId
              ? {
                  ...m,
                  content:
                    "Lo siento, tuve un problema. Por favor escríbenos directamente por [WhatsApp](https://wa.me/573001234567).",
                  isStreaming: false,
                }
              : m
          )
        );
        setQuickReplies(["💬 WhatsApp directo", "🔄 Intentar de nuevo"]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, sessionId, options]
  );

  // ── Limpiar historial ─────────────────────────────────────
  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([
      {
        id: "welcome-new",
        role: "assistant",
        content: "¡Hola de nuevo! ¿En qué puedo ayudarte?",
        timestamp: new Date(),
      },
    ]);
    setQuickReplies(QUICK_REPLIES_BY_CONTEXT.greeting);
  }, []);

  return {
    messages,
    isOpen,
    isLoading,
    quickReplies,
    unreadCount,
    bottomRef,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    clearHistory,
  };
}
