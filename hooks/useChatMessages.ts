"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import type { Message } from "@/components/chat/ChatContent";

const WAITING_PHRASES = [
  { delay: 1000,  text: "Einen Moment bitte, die Bearbeitung Ihres Anliegens wird gestartet." },
  { delay: 5000,  text: "Ich stelle die relevanten Informationen für Sie zusammen." },
  { delay: 10000, text: "Vielen Dank für Ihre Geduld. Ich bereite die Antwort für Sie vor." },
  { delay: 20000, text: "Aufgrund eines erhöhten Anfrageaufkommens kann die Antwort etwas länger dauern." },
];

export function useChatMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [waitingPhrase, setWaitingPhrase] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

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
    return () => clearWaitingTimeouts();
  }, [clearWaitingTimeouts]);

  const setTranscribedText = (text: string) => {
    setInput(text);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: currentInput }]);
    setInput("");
    setIsLoading(true);
    startWaitingPhrases();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg: currentInput, language: "de" }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Network response error");
      }

      clearWaitingTimeouts();
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: "" }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { ...last, content: last.content + chunk };
          return updated;
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "Fehler bei der Verbindung zum Server." },
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
