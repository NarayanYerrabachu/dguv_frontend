"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";

import ChatLayout from "@/components/chat/ChatLayout";
import MessageList from "@/components/chat/MessageList";
import ChatInputArea from "@/components/chat/ChatInputArea";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";

export type Message = {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
};

export default function ChatContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  const { isRecording, toggleRecording } = useAudioRecorder({
    onRecordingComplete: (audioUrl) => {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: "", audioUrl },
        { role: "assistant", content: "Keine Textumwandlung verfügbar. Bitte Nachricht als Text eingeben." },
      ]);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setMessages((prev) => [...prev, { role: "user", content: currentInput }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg: currentInput, language: "de" }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Network response error");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

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
        { role: "assistant", content: "Fehler bei der Verbindung zum Server." },
      ]);
    } finally {
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

  const sharedProps = {
    input,
    isLoading,
    isRecording,
    onInputChange: handleInputChange,
    onKeyDown: handleKeyDown,
    onSubmit: handleSubmit,
    onMicrophoneClick: toggleRecording,
  };

  return (
    <ChatLayout>
      {hasMessages ? (
        <>
          <MessageList
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
          />
          <ChatInputArea {...sharedProps} />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-440">
            <ChatInputArea {...sharedProps} />
          </div>
        </div>
      )}
    </ChatLayout>
  );
}
