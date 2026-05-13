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
    <footer className="animate-slide-up-fade w-full shrink-0 border-t border-gray-200 pt-3 sm:pt-4">
      {isRecording ? (
        <div className="flex w-full items-center gap-3 rounded-lg border-t border-transparent bg-[#d8efff] px-4 shadow-sm min-h-10 sm:min-h-12 animate-[recordingBox_1.4s_ease-in-out_infinite]">
          <span className="h-3 w-3 shrink-0 rounded-full bg-red-500 animate-[recordingDot_1s_ease-in-out_infinite]" />
          <span className="flex-1 text-sm sm:text-base text-[#003366] font-['Source_Sans_3',ui-sans-serif,system-ui,sans-serif]">
            Aufnahme läuft...
          </span>
          <button
            type="button"
            onClick={onMicrophoneClick}
            className="flex h-8 w-8 items-center justify-center rounded-full border-none bg-blue-200 shadow-sm transition-all duration-200 sm:h-9 sm:w-9 cursor-pointer hover:bg-blue-300"
            title="Aufnahme stoppen"
          >
            <span className="h-3 w-3 rounded-sm bg-[#004994]" />
          </button>
        </div>
      ) : (
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
      )}
    </footer>
  );
}
