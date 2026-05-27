import { RefObject } from "react";
import ChatMessage from "./ChatMessage";
import LoadingDots from "./LoadingDots";
import type { Message } from "@/components/chat/ChatContent";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  waitingPhrase: string | null;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  hidden?: boolean;
}

export default function MessageList({
  messages,
  isLoading,
  waitingPhrase,
  messagesEndRef,
  hidden = false,
}: MessageListProps) {
  return (
    <main className={`chat-scrollbar min-h-0 flex-1 overflow-y-auto px-1 py-6 sm:px-4 sm:py-10 ${hidden ? "hidden" : ""}`}>
      <div className="flex w-full flex-col gap-8">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            sources={message.sources}
            isError={message.isError}
          />
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
            <div className="max-w-[calc(100%-56px)] rounded-none px-5 py-4 text-[0.9375rem] leading-[1.6] border border-gray-200 bg-white text-[#333333] shadow-sm flex flex-col gap-2">
              <LoadingDots />

              {waitingPhrase && (
                <span className="text-sm text-[#333333]">{waitingPhrase}</span>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </main>
  );
}
