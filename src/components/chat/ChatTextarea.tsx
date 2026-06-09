'use client';

import { useEffect, useRef } from 'react';

interface ChatTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export default function ChatTextarea({ value, onChange, onKeyDown }: ChatTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      autoComplete="off"
      placeholder="Stellen Sie mir eine Frage."
      rows={1}
      className="placeholder:text-[#84a2bf] textarea-scrollbar min-h-10 min-w-0 
      max-h-40 flex-1 resize-none rounded-none border-none bg-white px-3 py-2 
      text-[11px] placeholder:text-[13px] leading-normal text-black shadow-[7px_7px_5px_rgba(0,0,0,0.23)] outline-none sm:min-h-12 
      sm:px-4 sm:py-3 sm:text-sm"
    />
  );
}
