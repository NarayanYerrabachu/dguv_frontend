'use client';

import { useRouter } from 'next/navigation';
import { PiChatCircleText } from 'react-icons/pi';
import AvatarCircle from './AvatarCircle';
import { LINKS } from '@/lib/links';

export default function WelcomeContent() {
  const router = useRouter();

  return (
    <>
      <AvatarCircle />

      <div className="mb-6">
        <p className="text-[19.5px] leading-[1.35] text-[#333333] mb-4">
          Willkommen,
          <br />
          ich bin der Chatbot der DGUV zu dem Thema &bdquo;Sicherheit und
          Gesundheit in Bildungseinrichtungen&ldquo;.
        </p>

        <p className="text-[19px] leading-[1.35] text-[#333333] mb-4">
          Mein Wissen basiert auf der Expertise der gesetzlichen
          Unfallversicherung. Stellen Sie mir gern Ihre Fragen! Da ich mir
          unsere Unterhaltung nicht merke, benötige ich bei Rückfragen
          genügend Kontext, um Ihre Frage gezielt beantworten zu können.
        </p>

        <p className="text-[17px] leading-[1.35] text-[#386ba7] mb-0">

          Bitte beachten Sie:
          <br />
          Mit Beginn der Unterhaltung stimmen Sie meinen{' '}
          <a
            href={LINKS.nutzungsbedingungen}
            target="_blank"
            rel="noopener noreferrer"
            className="underline" style={{ color: '#8e5aae' }}
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
            className="underline" style={{ color: '#8e5aae' }}
          >
            Datenschutzerklärung
          </a>
          . Ich würde mich freuen, wenn Sie mir nach unserer Unterhaltung
          ein Feedback zu Ihrer Benutzungserfahrung geben.
        </p>
      </div>
      <button onClick={() => router.push('/chat')} className="w-100 h-14 mx-auto  mt-4 flex items-center 
      justify-center gap-3 bg-[#afca0b] text-black text-[20px] font-semibold 
      cursor-pointer transition-transform hover:scale-105" >
        <span>Dialog starten</span>

        <PiChatCircleText size={28} />
      </button>
    </>
  );
}
