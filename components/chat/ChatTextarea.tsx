interface ChatTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export default function ChatTextarea({ value, onChange, onKeyDown }: ChatTextareaProps) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder="Stellen Sie mir eine Frage."
      rows={1}
      className="min-h-12 max-h-[120px] flex-1 resize-none rounded-lg border-none bg-white px-4 py-3 text-base leading-[1.5] text-[#003366] shadow-sm outline-none font-['Source_Sans_3',ui-sans-serif,system-ui,sans-serif]"
    />
  );
}
