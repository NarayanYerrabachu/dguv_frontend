"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          msg: input,
          language: "de"
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.msg || data.response || "Entschuldigung, es gab einen Fehler.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Mikrofonzugriff verweigert");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      const response = await fetch("/api/transcription", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Transcription failed");
      }

      const data = await response.json();
      setInput(data.text || "");
    } catch (error) {
      console.error("Transcription error:", error);
      alert("Transkription fehlgeschlagen");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleMicrophoneClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#ffffff' }}>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6" style={{ paddingBottom: 'calc(80px + var(--footer-height))' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {messages.length === 0 && (
            <div style={{
              textAlign: 'center',
              marginTop: '5rem',
              color: '#666666',
              fontFamily: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif"
            }}>
              <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                Stellen Sie mir eine Frage.
              </p>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  gap: '0.75rem',
                  alignItems: 'flex-start'
                }}
              >
                {/* Avatar Circle */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    minWidth: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#004994',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{
                    color: '#ffffff',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    fontFamily: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif"
                  }}>
                    {message.role === "user" ? "U" : "A"}
                  </span>
                </div>
                {/* Message Bubble */}
                <div
                  style={{
                    maxWidth: 'calc(100% - 56px)',
                    padding: '1rem 1.25rem',
                    borderRadius: '0.5rem',
                    backgroundColor: message.role === "user" ? "#004994" : "#ffffff",
                    color: message.role === "user" ? "#ffffff" : "#333333",
                    border: message.role === "assistant" ? "1px solid #e5e7eb" : "none",
                    boxShadow: message.role === "assistant" ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    fontFamily: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif"
                  }}
                >
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    minWidth: '40px',
                    borderRadius: '50%',
                    backgroundColor: "#004994"
                  }}
                />
                <div
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '0.5rem',
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <div
                        key={i}
                        style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#004994',
                          borderRadius: '50%',
                          animation: `bounce 1.4s infinite ease-in-out ${delay}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div style={{
        backgroundColor: '#f9fafb',
        borderTop: '1px solid #e5e7eb',
        position: 'fixed',
        bottom: 'var(--footer-height)',
        left: 0,
        right: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
              {/* Text Input */}
              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Stellen Sie mir eine Frage."
                  rows={1}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    backgroundColor: '#ffffff',
                    color: '#003366',
                    fontSize: '1rem',
                    lineHeight: 1.5,
                    fontFamily: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif",
                    resize: 'none',
                    outline: 'none',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    minHeight: '48px',
                    maxHeight: '120px'
                  }}
                />
              </div>

              {/* Microphone Button */}
              <button
                type="button"
                onClick={handleMicrophoneClick}
                disabled={isTranscribing}
                style={{
                  width: '48px',
                  height: '48px',
                  minWidth: '48px',
                  borderRadius: '0.5rem',
                  backgroundColor: isRecording ? 'rgba(220, 50, 50, 0.1)' : '#ffffff',
                  border: 'none',
                  cursor: isTranscribing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s',
                  opacity: isTranscribing ? 0.5 : 1
                }}
                title={isRecording ? "Aufnahme stoppen" : "Sprachaufnahme"}
              >
                {isTranscribing ? (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(0, 73, 148, 0.15)',
                    borderTopColor: '#004994',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                ) : (
                  <Image
                    src="/microphone.svg"
                    alt="Microphone"
                    width={20}
                    height={20}
                    style={{
                      filter: 'invert(17%) sepia(82%) saturate(1200%) hue-rotate(196deg) brightness(80%)'
                    }}
                  />
                )}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{
                  width: '48px',
                  height: '48px',
                  minWidth: '48px',
                  borderRadius: '0.5rem',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s',
                  opacity: !input.trim() || isLoading ? 0.5 : 1
                }}
                title="Senden"
              >
                <Image
                  src="/paper-plane-right.svg"
                  alt="Send"
                  width={20}
                  height={20}
                  style={{
                    filter: 'invert(17%) sepia(82%) saturate(1200%) hue-rotate(196deg) brightness(80%)'
                  }}
                />
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
