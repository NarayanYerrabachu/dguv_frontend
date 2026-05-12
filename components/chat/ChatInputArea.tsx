import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";

import ChatTextarea from "./ChatTextarea";
import MicrophoneButton from "./MicrophoneButton";
import SendButton from "./SendButton";

interface ChatInputAreaProps {
  input: string;
  isLoading: boolean;
  isRecording: boolean;
  onInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onMicrophoneClick: () => void;
}

export default function ChatInputArea({
  input,
  isLoading,
  isRecording,
  onInputChange,
  onKeyDown,
  onSubmit,
  onMicrophoneClick,
}: ChatInputAreaProps) {
  return (
    <footer className="w-full shrink-0 border-t border-gray-200 pt-3 sm:pt-4">
      <form onSubmit={onSubmit}>
        <div className="flex w-full items-end gap-1.5 sm:gap-2">
          <ChatTextarea
            value={input}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
          />

          <SendButton disabled={Boolean(!input.trim() || isLoading)} />

          <MicrophoneButton
            isRecording={isRecording}
            onClick={onMicrophoneClick}
          />
        </div>
      </form>
    </footer>
  );
}
