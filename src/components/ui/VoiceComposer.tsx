"use client";

import { useEffect, useState } from "react";

type SpeechRecognitionResultLike = { transcript: string; isFinal: boolean };

/** Full-panel voice-input state for SearchComposer's voice mode — a
 * listening orb + live transcript, replacing the pill entirely rather than
 * living inside it (matches the reference UI, which treats voice as its
 * own screen, not an inline affordance). Only mounted once
 * SpeechRecognition support has already been confirmed by the caller.
 * Switching back to text mode happens via SearchComposer's Text/Voice
 * toggle, not from a control inside this panel. */
export function VoiceComposer({ onResult }: { onResult: (text: string) => void }) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");

  useEffect(() => {
    type SpeechRecognitionConstructor = new () => {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      start: () => void;
      stop: () => void;
      onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<SpeechRecognitionResultLike> & { isFinal: boolean }> }) => void) | null;
      onend: (() => void) | null;
      onerror: (() => void) | null;
    };
    const w = window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };
    const SpeechRecognitionImpl = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognitionImpl) return;

    const recognition = new SpeechRecognitionImpl();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.onresult = (e) => {
      let finalText = "";
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) finalText += transcript;
        else interimText += transcript;
      }
      setInterim(interimText);
      if (finalText.trim()) onResult(finalText.trim());
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.start();
    setListening(true);

    return () => recognition.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-[275px] w-full flex-col items-center justify-center gap-5 overflow-hidden rounded-[2rem] bg-gradient-to-br from-accent-600 via-accent-800 to-accent-900 px-6 text-center">
      <div className="voice-orb h-20 w-20 rounded-full sm:h-24 sm:w-24" aria-hidden="true" />
      <p className="min-h-7 max-w-sm text-lg font-medium text-white">
        {interim || (listening ? "I’m listening… what’s on your mind?" : "Tap the mic to start speaking")}
      </p>
      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
        Coming soon
      </span>
    </div>
  );
}
