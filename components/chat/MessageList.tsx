import { RefObject } from "react";
import ChatMessage from "./ChatMessage";
import LoadingMessage from "./LoadingMessage";
import type { Message } from "@/components/ChatContent";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export default function MessageList({
  messages,
  isLoading,
  messagesEndRef,
}: MessageListProps) {
  return (
    <main className="chat-scrollbar min-h-0 flex-1 overflow-y-auto px-1 py-3 sm:px-4 sm:py-6">
      <div className="flex w-full flex-col gap-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
            audioUrl={message.audioUrl}
          />
        ))}

        {isLoading && <LoadingMessage />}

        <div ref={messagesEndRef} />
      </div>
    </main>
  );
}
