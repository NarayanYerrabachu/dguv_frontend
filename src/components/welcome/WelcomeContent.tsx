'use client';

import { useRouter } from 'next/navigation';
import { PiChatCircleText } from 'react-icons/pi';
import AvatarCircle from './AvatarCircle';
import { LINKS } from '@/lib/links';

const normal = {
  textPrimary:  'text-[16px] sm:text-[19.5px]',
  textSecondary: 'text-[14px] sm:text-[17px]',
  btnWidth:     'w-full sm:w-100',
  btnHeight:    'h-14',
  btnText:      'text-[16px] sm:text-[19.5px]',
};

const xl = {
  textPrimary:  'min-[2100px]:text-[21px]',
  textSecondary: 'min-[2100px]:text-[16px]',
  btnWidth:     'min-[2100px]:w-94',
  btnHeight:    'min-[2100px]:h-14',
  btnText:      'min-[2100px]:text-[21px]',
};

export default function WelcomeContent() {
  const router = useRouter();

  return (
    <>
      <AvatarCircle />

      <div className="mb-6">
        <p className={`${normal.textPrimary} ${xl.textPrimary} leading-[1.35] text-[#333333] mb-4`}>
          Willkommen,
          <br />
          ich bin der KI-Chatbot der DGUV zu dem Thema &bdquo;Sicherheit und
          Gesundheit in Bildungseinrichtungen&ldquo;.
        </p>

        <p className={`${normal.textPrimary} ${xl.textPrimary} leading-[1.35] text-[#333333] mb-4`}>
          Mein Wissen basiert auf der Expertise der gesetzlichen
          Unfallversicherung. Stellen Sie mir gern Ihre Fragen! Da ich mir
          unsere Unterhaltung nicht merke, benötige ich bei Rückfragen
          genügend Kontext, um Ihre Frage gezielt beantworten zu können.
        </p>

        <p className={`${normal.textSecondary} ${xl.textSecondary} leading-[1.35] text-[#386ba7] mb-0`}>
          Bitte beachten Sie:
          <br />
          Mit Beginn der Unterhaltung stimmen Sie meinen{' '}
          <a
            href={LINKS.nutzungsbedingungen}
            target="_blank"
            rel="noopener noreferrer"
            className="underline" style={{ color: '-webkit-link' }}
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
            className="underline" style={{ color: '-webkit-link' }}
          >
            Datenschutzerklärung
          </a>
          . Ich würde mich freuen, wenn Sie mir nach unserer Unterhaltung
          ein Feedback zu Ihrer Benutzungserfahrung geben.
        </p>
      </div>

      <button
        onClick={() => router.push('/chat')}
        className={`${normal.btnWidth} ${xl.btnWidth} ${normal.btnHeight} ${xl.btnHeight} ${normal.btnText} ${xl.btnText} mx-auto mt-6 sm:mt-auto flex items-center justify-center gap-3 bg-[#afca0b] text-black font-semibold cursor-pointer transition-transform hover:scale-105`}
      >
        <span>Dialog starten</span>
        <PiChatCircleText size={28} />
      </button>
    </>
  );
}
