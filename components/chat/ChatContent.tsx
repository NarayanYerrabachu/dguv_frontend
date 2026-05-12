"use client";

import ChatLayout from "@/components/chat/ChatLayout";
import MessageList from "@/components/chat/MessageList";
import ChatInputArea from "@/components/chat/ChatInputArea";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useChatMessages } from "@/hooks/useChatMessages";

export type Message = {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
};

export default function ChatContent() {
  const {
    messages,
    input,
    isLoading,
    messagesEndRef,
    addAudioMessage,
    handleSubmit,
    handleKeyDown,
    handleInputChange,
  } = useChatMessages();

  const { isRecording, toggleRecording } = useAudioRecorder({
    onRecordingComplete: addAudioMessage,
  });

  const hasMessages = messages.length > 0;

  const inputProps = {
    input,
    isLoading,
    isRecording,
    onInputChange: handleInputChange,
    onKeyDown: handleKeyDown,
    onSubmit: handleSubmit,
    onMicrophoneClick: toggleRecording,
  };

  return (
    <ChatLayout>
      {hasMessages ? (
        <>
          <MessageList
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
          />
          <ChatInputArea {...inputProps} />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-440">
            <ChatInputArea {...inputProps} />
          </div>
        </div>
      )}
    </ChatLayout>
  );
}
