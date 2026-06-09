"use client";

import ChatLayout from "@/components/chat/ChatLayout";
import MessageList from "@/components/chat/MessageList";
import ChatInputArea from "@/components/chat/ChatInputArea";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useChatMessages } from "@/hooks/useChatMessages";

export type Source = {
  title: string;
  url?: string;
  subItems?: string[];
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  isError?: boolean;
};

export default function ChatContent() {
  const {
    messages,
    input,
    isLoading,
    waitingPhrase,
    messagesEndRef,
    setTranscribedText,
    handleSubmit,
    handleKeyDown,
    handleInputChange,
  } = useChatMessages();

  const { isRecording, isTranscribing, toggleRecording } = useAudioRecorder({
    onTranscriptionComplete: setTranscribedText,
  });

  const hasMessages = messages.length > 0;

  const inputProps = {
    input,
    isLoading,
    isRecording,
    isTranscribing,
    onInputChange: handleInputChange,
    onKeyDown: handleKeyDown,
    onSubmit: handleSubmit,
    onMicrophoneClick: toggleRecording,
  };

  return (
    <ChatLayout>
      <MessageList
        messages={messages}
        isLoading={isLoading}
        waitingPhrase={waitingPhrase}
        messagesEndRef={messagesEndRef}
        hidden={!hasMessages}
      />
      <div className={!hasMessages ? "flex flex-1 items-center justify-center" : ""}>
        <ChatInputArea {...inputProps} />
      </div>
    </ChatLayout>
  );
}
