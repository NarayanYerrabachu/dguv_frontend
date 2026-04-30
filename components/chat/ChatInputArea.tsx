import ChatTextarea from "./ChatTextarea";
import MicrophoneButton from "./MicrophoneButton";
import SendButton from "./SendButton";

interface ChatInputAreaProps {
  input: string;
  isLoading: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onMicrophoneClick: () => void;
}

export default function ChatInputArea({
  input,
  isLoading,
  isRecording,
  isTranscribing,
  onInputChange,
  onKeyDown,
  onSubmit,
  onMicrophoneClick,
}: ChatInputAreaProps) {
  return (
<footer className="absolute  bottom-8 left-10 right-10 border-t border-gray-200">
  <form onSubmit={onSubmit}>
    <div className="flex items-end gap-2 ">
      <ChatTextarea
        value={input}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
      />

      <SendButton disabled={!input.trim() || isLoading} />

      <MicrophoneButton
        isRecording={isRecording}
        isTranscribing={isTranscribing}
        onClick={onMicrophoneClick}
      />
    </div>
  </form>
</footer>
  );
}
