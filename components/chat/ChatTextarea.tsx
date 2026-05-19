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
      className="textarea-scrollbar min-h-10 min-w-0 max-h-40 flex-1 resize-none rounded-lg border-none bg-white px-3 py-2 text-xs leading-normal text-black shadow-sm outline-none sm:min-h-12 sm:px-4 sm:py-3 sm:text-sm"
    />
  );
}
