import { RefObject } from "react";
import ChatMessage from "./ChatMessage";
import LoadingMessage from "./LoadingMessage";

type Message = {
  role: "user" | "assistant";
  content: string;
};

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
    <main className="flex-1 overflow-y-auto px-4 py-6 [padding-bottom:calc(80px+var(--footer-height))]">
      <div className="mx-auto flex max-w-[800px] flex-col gap-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
          />
        ))}

        {isLoading && <LoadingMessage />}

        <div ref={messagesEndRef} />
      </div>
    </main>
  );
}