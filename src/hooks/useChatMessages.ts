"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import type { Message, Source } from "@/components/chat/ChatContent";

function parseSourcesMarkdown(text: string): Source[] {
  const sources: Source[] = [];
  for (const line of text.split("\n")) {
    const sourceMatch = line.match(/^-\s+\[(.+?)\]\((.+?)\)/);
    if (sourceMatch) {
      sources.push({ title: sourceMatch[1], url: sourceMatch[2], subItems: [] });
      continue;
    }
    const subMatch = line.match(/^\s+\+\s+(.+)/);
    if (subMatch && sources.length > 0) {
      sources[sources.length - 1].subItems!.push(subMatch[1].trim());
    }
  }
  return sources;
}

const WAITING_PHRASES = [
  { delay: 0,    text: "Einen Moment bitte, ich prüfe Ihr Anliegen." },
  { delay: 3000, text: "Einen Augenblick bitte, ich prüfe derzeit verschiedene Quellen, um Ihnen eine möglichst genaue Antwort zu geben." },
  { delay: 7000,  text: "Ich stelle derzeit die bestmögliche Antwort für Sie zusammen." },
  { delay: 12000, text: "Vielen Dank für Ihre Geduld, ich bin gleich fertig." },
];

const TIMEOUT_MS = 30000;
const TIMEOUT_MESSAGE = "Aktuell kommt es aufgrund vieler Anfragen zu Verzögerungen. Bitte versuchen Sie es zu einem späteren Zeitpunkt erneut.";
const ERROR_MESSAGE = "Fehler bei der Verbindung zum Server.";

export function useChatMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [waitingPhrase, setWaitingPhrase] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottom = useRef(true);
  const isStreamingRef = useRef(false);
  const scrollToMessageIdRef = useRef<string | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);
  const requestTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [sessionId] = useState(() => crypto.randomUUID());

  const clearWaitingTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setWaitingPhrase(null);
    if (requestTimeoutRef.current) {
      clearTimeout(requestTimeoutRef.current);
      requestTimeoutRef.current = null;
    }
  }, []);

  const startWaitingPhrases = () => {
    timeoutsRef.current = WAITING_PHRASES.map(({ delay, text }) =>
      setTimeout(() => setWaitingPhrase(text), delay)
    );
  };

  // IntersectionObserver watches the sentinel div at the end of the message list.
  // When it is visible, the user is at the bottom; when hidden, they have scrolled up.
  // This avoids all scroll-event race conditions from programmatic scrolling.
  useEffect(() => {
    const sentinel = messagesEndRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting) isAtBottom.current = false; },
      { root: scrollContainerRef.current, threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const onScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    isAtBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight <= 40;
  }, []);

  useEffect(() => {
    if (scrollToMessageIdRef.current) {
      const id = scrollToMessageIdRef.current;
      scrollToMessageIdRef.current = null;
      const el = document.getElementById(`msg-${id}`);
      el?.scrollIntoView({ behavior: "instant", block: "start" });
      isAtBottom.current = false;
    } else if (isAtBottom.current && !isStreamingRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      clearWaitingTimeouts();
      readerRef.current?.cancel();
    };
  }, [clearWaitingTimeouts]);

  const setTranscribedText = (text: string) => setInput(text);

  const appendAssistantMessage = () => {
    const id = crypto.randomUUID();
    scrollToMessageIdRef.current = id;
    setMessages((prev) => [...prev, { id, role: "assistant", content: "" }]);
    return id;
  };

  const updateLastMessage = (patch: Partial<Message>) => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (!last || last.role !== "assistant") return prev;
      updated[updated.length - 1] = { ...last, ...patch };
      return updated;
    });
  };

  // ── SSE streaming via /api/chat/stream ──────────────────────────────────────
  const sendViaSSE = async (msg: string): Promise<boolean> => {
    let reader: ReadableStreamDefaultReader | null = null;
    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg, language: "de", context: sessionId }),
      });

      if (!response.ok || !response.body) return false;

      // Only append the assistant bubble once we know the stream is open
      clearWaitingTimeouts();
      isStreamingRef.current = true;
      appendAssistantMessage();

      reader = response.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const eventMatch = part.match(/^event: (\w+)/m);
          const dataMatch = part.match(/^data: (.+)/m);
          if (!dataMatch) continue;

          const eventType = eventMatch?.[1] ?? "message";
          let parsed: Record<string, unknown>;
          try {
            parsed = JSON.parse(dataMatch[1]);
          } catch {
            continue;
          }

          if (eventType === "token") {
            const token = parsed.token as string;
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (!last || last.role !== "assistant") return prev;
              updated[updated.length - 1] = { ...last, content: last.content + token };
              return updated;
            });
          } else if (eventType === "sources") {
            const sourcesText = (parsed.content ?? "") as string;
            const sources = parseSourcesMarkdown(sourcesText);
            if (sources.length > 0) updateLastMessage({ sources });
          } else if (eventType === "done") {
            // stream complete — nothing to do, content is already appended
          } else if (eventType === "error") {
            const errorText = (parsed.message as string) || ERROR_MESSAGE;
            // Use functional update to append to existing partial content
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (!last || last.role !== "assistant") return prev;
              const prefix = last.content ? last.content + "\n\n" : "";
              updated[updated.length - 1] = { ...last, isError: true, content: prefix + errorText };
              return updated;
            });
          }
        }
      }

      readerRef.current = null;
      // If stream completed but no tokens arrived, show error instead of empty bubble
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.content === "")
          return [...prev.slice(0, -1), { ...last, isError: true, content: TIMEOUT_MESSAGE }];
        return prev;
      });
      return true;
    } catch {
      await reader?.cancel();
      readerRef.current = null;
      // Remove the orphaned assistant bubble if it was added before the failure
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.content === "") return prev.slice(0, -1);
        return prev;
      });
      return false;
    }
  };

  // ── Fallback: plain streaming via /api/chat ─────────────────────────────────
  const sendViaFallback = async (msg: string): Promise<void> => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ msg, language: "de", context: sessionId }),
    });

    if (!response.ok || !response.body) throw new Error("Network response error");

    clearWaitingTimeouts();
    isStreamingRef.current = true;
    appendAssistantMessage();

    const reader = response.body.getReader();
    readerRef.current = reader;
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (!last || last.role !== "assistant") return prev;
          updated[updated.length - 1] = { ...last, content: last.content + chunk };
          return updated;
        });
      }
    } finally {
      readerRef.current = null;
    }
  };

  // ── Main send ───────────────────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    isAtBottom.current = true;
    const currentInput = input;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: currentInput }]);
    setInput("");
    setIsLoading(true);
    startWaitingPhrases();

    requestTimeoutRef.current = setTimeout(() => {
      readerRef.current?.cancel();
      clearWaitingTimeouts();
      isStreamingRef.current = false;
      setIsLoading(false);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        const base = (last?.role === "assistant" && last.content === "") ? prev.slice(0, -1) : prev;
        return [...base, { id: crypto.randomUUID(), role: "assistant", content: TIMEOUT_MESSAGE, isError: true }];
      });
    }, TIMEOUT_MS);

    try {
      const sseSuccess = await sendViaSSE(currentInput);
      if (!sseSuccess) {
        startWaitingPhrases();
        await sendViaFallback(currentInput);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: ERROR_MESSAGE, isError: true },
      ]);
    } finally {
      clearWaitingTimeouts();
      isStreamingRef.current = false;
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendMessage();
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await sendMessage();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return {
    messages,
    input,
    isLoading,
    waitingPhrase,
    messagesEndRef,
    scrollContainerRef,
    onScroll,
    setTranscribedText,
    handleSubmit,
    handleKeyDown,
    handleInputChange,
  };
}
