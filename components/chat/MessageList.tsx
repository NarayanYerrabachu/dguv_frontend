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
    // This area is scrollable and keeps messages inside the blue box
    <main className="chat-scrollbar min-h-0 flex-1 overflow-y-scroll px-4 py-6 pr-6">
      {/* Centers the message content and limits its width */}
      <div className="flex w-full flex-col gap-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
          />
        ))}

        {/* Shows loading animation while waiting for the assistant response */}
        {isLoading && <LoadingMessage />}

        {/* Invisible element used to scroll automatically to the latest message */}
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
}