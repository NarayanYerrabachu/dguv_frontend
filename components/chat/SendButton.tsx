import Image from "next/image";

interface SendButtonProps {
  disabled: boolean;
}

export default function SendButton({ disabled }: SendButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`flex h-12 w-12 min-w-12 items-center justify-center rounded-lg border-none bg-white shadow-sm transition-all duration-200 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
      title="Senden"
    >
      <Image
        src="/paper-plane-right.svg"
        alt="Send"
        width={20}
        height={20}
        className="[filter:invert(17%)_sepia(82%)_saturate(1200%)_hue-rotate(196deg)_brightness(80%)]"
      />
    </button>
  );
}
