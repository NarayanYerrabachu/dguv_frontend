"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import type { Message, Source } from "@/components/chat/ChatContent";

const WAITING_PHRASES = [
  { delay: 1000,  text: "Einen Moment bitte, die Bearbeitung Ihres Anliegens wird gestartet." },
  { delay: 5000,  text: "Ich stelle die relevanten Informationen für Sie zusammen." },
  { delay: 10000, text: "Vielen Dank für Ihre Geduld. Ich bereite die Antwort für Sie vor." },
  { delay: 20000, text: "Aufgrund eines erhöhten Anfrageaufkommens kann die Antwort etwas länger dauern." },
];

const ERROR_MESSAGE = "Fehler bei der Verbindung zum Server.";

export function useChatMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [waitingPhrase, setWaitingPhrase] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);

  const clearWaitingTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setWaitingPhrase(null);
  }, []);

  const startWaitingPhrases = () => {
    timeoutsRef.current = WAITING_PHRASES.map(({ delay, text }) =>
      setTimeout(() => setWaitingPhrase(text), delay)
    );
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        body: JSON.stringify({ msg, language: "de" }),
      });

      if (!response.ok || !response.body) return false;

      // Only append the assistant bubble once we know the stream is open
      clearWaitingTimeouts();
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
          } else if (eventType === "done") {
            const sources = (parsed.sources ?? []) as Source[];
            if (sources.length > 0) updateLastMessage({ sources });
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
      body: JSON.stringify({ msg, language: "de" }),
    });

    if (!response.ok || !response.body) throw new Error("Network response error");

    clearWaitingTimeouts();
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

    const currentInput = input;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: currentInput }]);
    setInput("");
    setIsLoading(true);
    startWaitingPhrases();

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
    setTranscribedText,
    handleSubmit,
    handleKeyDown,
    handleInputChange,
  };
}
