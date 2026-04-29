import MessageAvatar from "./MessageAvatar";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className="flex items-start justify-start gap-3">
      <MessageAvatar role={role} />

      <div
        className={`max-w-[calc(100%-56px)] rounded-lg px-5 py-4 text-[0.9375rem] leading-[1.6] font-['Source_Sans_3',ui-sans-serif,system-ui,sans-serif] ${
          role === "user"
            ? "bg-[#004994] text-white"
            : "border border-gray-200 bg-white text-[#333333] shadow-sm"
        }`}
      >
        <p className="m-0 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
