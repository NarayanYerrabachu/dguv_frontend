'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function FeedbackButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href="https://befragungen.dguv.de/evasys/online.php?p=Chatbotfeedback_2026"
      target="_blank"
      rel="noopener noreferrer"
      title="Feedback geben"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed right-4 top-1/2 -translate-y-1/2 w-[72px] h-[92px] border border-[#c8d3df] rounded-lg flex flex-col items-center justify-center gap-2 no-underline cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.10)] transition-all duration-200 ease-in-out z-50"
      style={{ backgroundColor: isHovered ? '#004994' : '#ffffff' }}
    >
      <Image
        src="/note-pencil.svg"
        alt="Feedback"
        width={34}
        height={34}
        className="w-[34px] h-[34px]"
        style={{ filter: isHovered ? 'brightness(0) invert(1)' : 'none' }}
      />

      <span
        className="text-sm font-normal font-['Source_Sans_3',Arial,sans-serif]"
        style={{ color: isHovered ? '#ffffff' : '#004994' }}
      >
        Feedback
      </span>
    </a>
  );
}