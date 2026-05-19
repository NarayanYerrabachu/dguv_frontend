import Image from "next/image";

interface MicrophoneButtonProps {
  isRecording: boolean;
  onClick: () => void;
}

export default function MicrophoneButton({
  isRecording,
  onClick,
}: MicrophoneButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex hover:bg-[#d8eeff] h-9 w-9 shrink-0 items-center justify-center rounded-lg border-none shadow-sm transition-all duration-200 sm:h-12 sm:w-12 ${
        isRecording ? "bg-[rgba(220,50,50,0.1)]" : "bg-white"
      } cursor-pointer`}
      aria-label={isRecording ? "Aufnahme stoppen" : "Sprachaufnahme starten"}
      title={isRecording ? "Aufnahme stoppen" : "Sprachaufnahme starten"}
    >
      {isRecording ? (
        <span className="h-3 w-3 rounded-sm bg-red-500 sm:h-4 sm:w-4" />
      ) : (
        <Image
          src="/microphone.svg"
          alt="Microphone"
          width={20}
          height={20}
          className="h-4 w-4 sm:h-5 sm:w-5 [filter:invert(17%)_sepia(82%)_saturate(1200%)_hue-rotate(196deg)_brightness(80%)]"
        />
      )}
    </button>
  );
}
