'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AvatarCircle from './AvatarCircle';
import { LINKS } from '@/lib/links';

export default function WelcomeContent() {
  const router = useRouter();

  return (
    <>
      <AvatarCircle />

      <div className="mb-[40px]">
        <p className="text-[16px] leading-[20.8px] text-[#333333] mb-4">
          Willkommen,
          <br />
          ich bin der Chatbot der DGUV zu dem Thema &bdquo;Sicherheit und
          Gesundheit in Bildungseinrichtungen&ldquo;.
        </p>

        <p className="text-[16px] leading-[20.8px] text-[#333333] mb-4">
          Mein Wissen basiert auf der Expertise der gesetzlichen
          Unfallversicherung. Stellen Sie mir gern Ihre Fragen! Da ich mir
          unsere Unterhaltung nicht merke, benötige ich bei Rückfragen
          genügend Kontext, um Ihre Frage gezielt beantworten zu können.
        </p>

        <p className="text-[14px] leading-[18.2px] text-[#333333] mb-0">
          Bitte beachten Sie:
          <br />
          Mit Beginn der Unterhaltung stimmen Sie meinen{' '}
          <a
            href={LINKS.nutzungsbedingungen}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#004994] underline"
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
            className="text-[#004994] underline"
          >
            Datenschutzerklärung
          </a>
          . Ich würde mich freuen, wenn Sie mir nach unserer Unterhaltung
          ein Feedback zu Ihrer Benutzungserfahrung geben.
        </p>
      </div>

      <button
        onClick={() => router.push('/chat')}
        className="w-[398px] h-[50px] flex items-center justify-center gap-3 bg-[#afca0b] text-black text-[18px] font-medium cursor-pointer transition-opacity hover:opacity-90"
      >
        <span>Dialog starten</span>
        <Image src="/chats-circle.svg" alt="" width={24} height={24} className="brightness-0" />
      </button>
    </>
  );
}
