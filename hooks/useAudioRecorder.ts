"use client";

import { useRef, useState } from "react";

type UseAudioRecorderOptions = {
  onRecordingComplete?: (audioUrl: string) => void;
  maxDurationSeconds?: number;
};

export function useAudioRecorder(options: UseAudioRecorderOptions = {}) {
  const { maxDurationSeconds = 100 } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const maxDurationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startRecording = async () => {
    try {
      setAudioUrl(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        options.onRecordingComplete?.(url);
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        mediaRecorderRef.current = null;
      };

      mediaRecorder.start();
      setIsRecording(true);

      maxDurationTimerRef.current = setTimeout(() => {
        stopRecording();
      }, maxDurationSeconds * 1000);
    } catch (error) {
      console.error("Recording error:", error);
      setIsRecording(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  };

  const stopRecording = () => {
    if (maxDurationTimerRef.current) {
      clearTimeout(maxDurationTimerRef.current);
      maxDurationTimerRef.current = null;
    }
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;
    if (mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return {
    isRecording,
    audioUrl,
    toggleRecording,
  };
}
