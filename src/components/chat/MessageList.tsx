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
    <main className={`chat-scrollbar min-h-0 flex-1 overflow-y-auto pr-6 pb-6 ${hidden ? "hidden" : ""}`}>
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
            <div className="max-w-[85%] px-6 py-5 text-base leading-normal bg-white text-[#333333] shadow-[7px_7px_5px_rgba(0,0,0,0.23)] flex flex-col gap-2">
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
