import { RefObject } from "react";
import ChatMessage from "./ChatMessage";
import LoadingDots from "./LoadingDots";
import type { Message } from "@/components/chat/ChatContent";

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

          />
        ))}

        {isLoading && (
          <div className="flex items-start justify-start gap-3">
            <div className="h-10 w-10 min-w-10 rounded-full bg-[#004994]" />
            <div className="rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm">
              <LoadingDots />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </main>
  );
}
