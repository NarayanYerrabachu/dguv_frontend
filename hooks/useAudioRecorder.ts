"use client";

import { useRef, useState } from "react";

type UseAudioRecorderOptions = {
  onTranscriptionComplete?: (text: string) => void;
  maxDurationSeconds?: number;
  silenceThreshold?: number;
  silenceTimeoutMs?: number;
};

// ── Browser Speech API path ──────────────────────────────────────────────────

interface ISpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: { results: { [i: number]: { [i: number]: { transcript: string } } } }) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
}

function useBrowserSpeech(onTranscriptionComplete?: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const w = window as unknown as { SpeechRecognition?: new () => ISpeechRecognition; webkitSpeechRecognition?: new () => ISpeechRecognition };
    const SpeechRecognitionAPI = w.SpeechRecognition ?? w.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.error("SpeechRecognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "de-DE";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript?.trim();
      if (text) onTranscriptionComplete?.(text);
    };

    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
  };

  return { isRecording, isTranscribing: false, toggleRecording };
}

// ── Backend (FastWhisper) path ───────────────────────────────────────────────

function useBackendTranscription(options: UseAudioRecorderOptions) {
  const {
    maxDurationSeconds = 60,
    silenceThreshold = 0.01,
    silenceTimeoutMs = 2000,
    onTranscriptionComplete,
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxDurationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const cleanup = (stream: MediaStream) => {
    stream.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      analyserRef.current = null;
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      const response = await fetch("/api/transcription", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Transcription request failed");

      const data = await response.json();
      const text = data.text?.trim();
      if (text) onTranscriptionComplete?.(text);
    } catch (error) {
      console.error("Transcription error:", error);
    } finally {
      setIsTranscribing(false);
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
    if (mediaRecorder.state === "recording") mediaRecorder.stop();
    setIsRecording(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;
      audioContext.createMediaStreamSource(stream).connect(analyser);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioChunksRef.current = [];
        cleanup(stream);
        transcribeAudio(audioBlob);
      };

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);
      const checkSilence = () => {
        analyser.getFloatTimeDomainData(dataArray);
        const rms = Math.sqrt(dataArray.reduce((sum, val) => sum + val * val, 0) / bufferLength);

        if (rms < silenceThreshold) {
          if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => stopRecording(), silenceTimeoutMs);
          }
        } else {
          cancelSilenceTimer();
        }
        animationFrameRef.current = requestAnimationFrame(checkSilence);
      };
      animationFrameRef.current = requestAnimationFrame(checkSilence);

      mediaRecorder.start();
      setIsRecording(true);

      maxDurationTimerRef.current = setTimeout(() => stopRecording(), maxDurationSeconds * 1000);
    } catch (error) {
      console.error("Recording error:", error);
      setIsRecording(false);
      cancelSilenceTimer();
      cancelAnimationLoop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        analyserRef.current = null;
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  return { isRecording, isTranscribing, toggleRecording };
}

// ── Public hook — wählt automatisch den richtigen Pfad ──────────────────────

export function useAudioRecorder(options: UseAudioRecorderOptions = {}) {
  const useBrowser = process.env.NEXT_PUBLIC_STT_USE_BROWSER === "true";

  const browser = useBrowserSpeech(options.onTranscriptionComplete);
  const backend = useBackendTranscription(options);

  return useBrowser ? browser : backend;
}
