import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { CgChevronDown } from "react-icons/cg";
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
        className={`max-w-[85%] px-6 py-5 text-[15px] leading-normal shadow-[7px_7px_5px_rgba(0,0,0,0.23)] ${
          isUser
            ? "bg-[#004994] text-white"
            : isError
            ? "bg-red-50 text-red-700"
            : "bg-white text-[#333333]"
        }`}
      >
        {isUser ? (
          <p className="m-0 whitespace-pre-wrap break-words">{content}</p>
        ) : (
          <div className="prose prose-base max-w-none break-words
            prose-headings:font-semibold prose-headings:text-[#333333] prose-headings:mt-4 prose-headings:mb-1
            prose-h3:text-base
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
              <CgChevronDown className={`text-[#004994] transition-transform duration-300 ${sourcesOpen ? "rotate-180" : "rotate-0"}`} />
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
