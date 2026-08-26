/** Purely visual "voice mode" panel for SearchComposer — an orb and a
 * "Coming soon" label, matching the reference UI's full-screen voice
 * treatment. Deliberately makes no SpeechRecognition call and requests no
 * microphone permission; voice input isn't implemented yet, so this never
 * pretends to listen. Switching back to text mode happens via
 * SearchComposer's Text/Voice toggle, not from a control inside this
 * panel. */
export function VoiceComposer() {
  return (
    <div className="flex h-[275px] w-full flex-col items-center justify-center gap-5 overflow-hidden rounded-[2rem] bg-gradient-to-br from-accent-600 via-accent-800 to-accent-900 px-6 text-center">
      <div className="voice-orb h-20 w-20 rounded-full sm:h-24 sm:w-24" aria-hidden="true" />
      <p className="min-h-7 max-w-sm text-lg font-medium text-white">Tap the mic to start speaking</p>
      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
        Coming soon
      </span>
    </div>
  );
}
