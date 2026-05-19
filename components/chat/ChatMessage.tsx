interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex items-start gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[calc(100%-56px)] rounded-lg px-5 py-4 text-[0.9375rem] leading-[1.6] font-['Source_Sans_3',ui-sans-serif,system-ui,sans-serif] ${
          isUser
            ? "bg-[#004994] text-white"
            : "border border-gray-200 bg-white text-[#333333] shadow-sm"
        }`}
      >
        <p className="m-0 whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  );
}
