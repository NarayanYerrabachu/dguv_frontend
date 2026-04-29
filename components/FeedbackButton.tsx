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
      style={{
        position: 'fixed',
        right: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',

        width: '72px',
        height: '92px',

        backgroundColor: isHovered ? '#004994' : '#ffffff',
        border: '1px solid #c8d3df',
        borderRadius: '8px',

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',

        textDecoration: 'none',
        cursor: 'pointer',

        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.10)',
        transition: 'all 0.2s ease',
        zIndex: 50,
      }}
    >
      <Image
        src="/note-pencil.svg"
        alt="Feedback"
        width={34}
        height={34}
        style={{
          width: '34px',
          height: '34px',
          filter: isHovered ? 'brightness(0) invert(1)' : 'none',
        }}
      />

      <span
        style={{
          fontSize: '14px',
          fontWeight: 400,
          color: isHovered ? '#ffffff' : '#004994',
          fontFamily: "'Source Sans 3', Arial, sans-serif",
        }}
      >
        Feedback
      </span>
    </a>
  );
}