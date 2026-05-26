import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Source } from "@/components/chat/ChatContent";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  isError?: boolean;
}

export default function ChatMessage({ role, content, sources, isError }: ChatMessageProps) {
  const isUser = role === "user";
  const [sourcesOpen, setSourcesOpen] = useState(false);

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
        {isUser ? (
          <p className="m-0 whitespace-pre-wrap break-words">{content}</p>
        ) : (
          <div className="prose prose-sm max-w-none break-words
            prose-headings:font-semibold prose-headings:text-[#333333] prose-headings:mt-4 prose-headings:mb-1
            prose-h3:text-[0.9375rem]
            prose-p:my-2 prose-p:text-[#333333]
            prose-ul:my-2 prose-ul:pl-5 prose-ul:list-disc
            prose-li:text-[#333333] prose-li:my-0.5 prose-li:marker:text-black
            prose-strong:text-[#333333]
            prose-a:text-[#004994] prose-a:underline hover:prose-a:text-[#003070]">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}

        {sources && sources.length > 0 && (
          <div className="mt-3 border-t border-gray-200 pt-3">
            <button
              onClick={() => setSourcesOpen((o) => !o)}
              className="flex items-center gap-1 text-sm text-[#004994] underline hover:text-[#003070] cursor-pointer select-none"
            >
              Quellen anzeigen
              <span className="no-underline">{sourcesOpen ? "∧" : "∨"}</span>
            </button>

            {sourcesOpen && (
              <ul className="m-0 mt-3 list-disc pl-5 flex flex-col gap-2">
                {sources.map((source, i) => (
                  <li key={i} className="text-sm text-[#333]">
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
                    {source.subItems && source.subItems.length > 0 && (
                      <ul className="mt-1 list-[circle] pl-5 flex flex-col gap-0.5">
                        {source.subItems.map((sub, j) => (
                          <li key={j} className="text-xs text-[#555]">{sub}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
