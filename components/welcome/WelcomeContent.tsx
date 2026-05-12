'use client';

import { useRouter } from 'next/navigation';
import AvatarCircle from './AvatarCircle';
import { LINKS } from '@/lib/links';
import { useLanguage } from '@/context/LanguageContext';

export default function WelcomeContent() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const legalText =
    language === 'de' ? (
      <p className="text-[16px] leading-[1.35] text-[#0050b5] mb-0 font-['Source_Sans_3']">
        Bitte beachten Sie:
        <br />
        Mit Beginn der Unterhaltung stimmen Sie meinen{' '}
        <a
          href={LINKS.nutzungsbedingungen}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#551A8B] underline"
        >
          Nutzungsbedingungen
        </a>{' '}
        zu.
        <br />
        Die Eingabe von personenbezogenen Daten ist zudem nicht gestattet.
        Bitte beachten Sie in diesem Zusammenhang auch meine{' '}
        <a
          href={LINKS.datenschutz}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#551A8B] underline"
        >
          Datenschutzerklärung
        </a>
        . Ich würde mich freuen, wenn Sie mir nach unserer Unterhaltung
        ein Feedback zu Ihrer Benutzungserfahrung geben.
      </p>
    ) : (
      <p className="text-[16px] leading-[1.35] text-[#0050b5] mb-0 font-['Source_Sans_3']">
        Please note:
        <br />
        By starting the conversation, you agree to my{' '}
        <a
          href={LINKS.nutzungsbedingungen}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#551A8B] underline"
        >
          Terms of use
        </a>
        .
        <br />
        The entry of personal data is also not permitted. Please also refer to
        my{' '}
        <a
          href={LINKS.datenschutz}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#551A8B] underline"
        >
          Privacy policy
        </a>
        . I would be happy if you gave me feedback on your experience after our
        conversation.
      </p>
    );

  return (
    <>
      <AvatarCircle />

      <div className="mb-6">
        <p className="text-[18px] leading-[1.35] text-[#222] mb-4 font-['Source_Sans_3']">
          {t.welcome.title}
        </p>

        <p className="text-[18px] leading-[1.35] text-[#222] mb-4 font-['Source_Sans_3']">
          {t.welcome.description}
        </p>

        {legalText}
      </div>

      <button
        onClick={() => router.push('/chat')}
        className="w-80 h-[50px] mx-auto flex items-center justify-center gap-3 bg-[#b6d900] text-black text-[20px] font-semibold cursor-pointer transition-transform hover:scale-105"
      >
        <span>{t.welcome.startButton}</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          width={22}
          height={22}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
          />
        </svg>
      </button>
    </>
  );
}
