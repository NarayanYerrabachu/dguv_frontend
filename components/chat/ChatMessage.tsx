import type { Source } from "@/components/chat/ChatContent";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  isError?: boolean;
}

export default function ChatMessage({ role, content, sources, isError }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[calc(100%-56px)] rounded-none px-5 py-4 text-[0.9375rem] leading-[1.6] font-['Source_Sans_3',ui-sans-serif,system-ui,sans-serif] ${
          isUser
            ? "bg-[#004994] text-white"
            : isError
            ? "border border-red-200 bg-red-50 text-red-700 shadow-sm"
            : "border border-gray-200 bg-white text-[#333333] shadow-sm"
        }`}
      >
        <p className="m-0 whitespace-pre-wrap break-words">{content}</p>

        {sources && sources.length > 0 && (
          <div className="mt-3 border-t border-gray-200 pt-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#004994]">
              Quellen
            </p>
            <ul className="m-0 list-none p-0 flex flex-col gap-1">
              {sources.map((source, i) => (
                <li key={i} className="text-xs text-[#555]">
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#004994] underline hover:text-[#003070]"
                    >
                      {source.title}
                    </a>
                  ) : (
                    <span>{source.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
