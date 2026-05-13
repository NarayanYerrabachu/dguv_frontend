"use client";

import Image from "next/image";

interface SendButtonProps {
  disabled: boolean;
}

export default function SendButton({ disabled }: SendButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-none bg-white shadow-sm transition-all duration-200 sm:h-12 sm:w-12 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
      title="Senden"
    >
      <Image
        src="/paper-plane-right.svg"
        alt="Send"
        width={20}
        height={20}
        className="h-4 w-4 sm:h-5 sm:w-5 filter-[invert(17%)_sepia(82%)_saturate(1200%)_hue-rotate(196deg)_brightness(80%)]"
      />
    </button>
  );
}
