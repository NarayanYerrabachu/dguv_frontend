"use client";

import { useRef, useState } from "react";

type UseAudioRecorderOptions = {
  onRecordingComplete?: (audioUrl: string) => void;
  maxDurationSeconds?: number;
  silenceThreshold?: number;
  silenceTimeoutMs?: number;
};

export function useAudioRecorder(options: UseAudioRecorderOptions = {}) {
  const {
    maxDurationSeconds = 100,
    silenceThreshold = 0.01,
    silenceTimeoutMs = 3000,
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxDurationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentAudioUrlRef = useRef<string | null>(null);

  const cancelSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const cancelAnimationLoop = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const stopRecording = () => {
    if (maxDurationTimerRef.current) {
      clearTimeout(maxDurationTimerRef.current);
      maxDurationTimerRef.current = null;
    }
    cancelSilenceTimer();
    cancelAnimationLoop();

    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;
    if (mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
    setIsRecording(false);
  };

  const startRecording = async () => {
    try {
      if (currentAudioUrlRef.current) {
        URL.revokeObjectURL(currentAudioUrlRef.current);
        currentAudioUrlRef.current = null;
      }
      setAudioUrl(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      audioContext.createMediaStreamSource(stream).connect(analyser);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioChunksRef.current = [];

        const url = URL.createObjectURL(audioBlob);
        currentAudioUrlRef.current = url;
        setAudioUrl(url);
        options.onRecordingComplete?.(url);

        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        mediaRecorderRef.current = null;

        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
          analyserRef.current = null;
        }
      };

      // Silence detection: auto-stop after silenceTimeoutMs of quiet input
      const dataArray = new Uint8Array(analyser.fftSize);
      const checkSilence = () => {
        analyser.getByteTimeDomainData(dataArray);
        const average =
          dataArray.reduce((sum, val) => sum + Math.abs(val - 128), 0) /
          dataArray.length /
          128;

        if (average < silenceThreshold) {
          if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => {
              stopRecording();
            }, silenceTimeoutMs);
          }
        } else {
          cancelSilenceTimer();
        }

        animationFrameRef.current = requestAnimationFrame(checkSilence);
      };
      animationFrameRef.current = requestAnimationFrame(checkSilence);

      mediaRecorder.start();
      setIsRecording(true);

      maxDurationTimerRef.current = setTimeout(() => {
        stopRecording();
      }, maxDurationSeconds * 1000);
    } catch (error) {
      console.error("Recording error:", error);
      setIsRecording(false);
      cancelSilenceTimer();
      cancelAnimationLoop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        analyserRef.current = null;
      }
    }
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
