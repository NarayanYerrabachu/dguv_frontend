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
      <div className="flex w-full flex-col gap-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}

        {isLoading && (
          <div className="flex items-start justify-start gap-3">
            <div className="h-10 w-10 min-w-10 rounded-full bg-[#004994]" />
            <div className="rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm">
              {waitingPhrase ? (
                <p className="m-0 text-sm text-[#333333] font-['Source_Sans_3',ui-sans-serif,system-ui,sans-serif]">
                  {waitingPhrase}
                </p>
              ) : (
                <LoadingDots />
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </main>
  );
}
