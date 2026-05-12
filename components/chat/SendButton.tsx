"use client";

import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface SendButtonProps {
  disabled: boolean;
}

export default function SendButton({ disabled }: SendButtonProps) {
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      type="submit"
      disabled={mounted && disabled}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-none bg-white shadow-sm transition-all duration-200 sm:h-12 sm:w-12 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
      title={t.chat.send}
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
