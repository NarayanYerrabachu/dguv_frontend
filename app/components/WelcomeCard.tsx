'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function WelcomeCard() {
  const router = useRouter();

  return (
    <section className="w-full bg-white py-6">
      <div className="w-full max-w-[1700px]  mx-auto bg-[#d8eefc] shadow-[8px_8px_8px_rgba(0,0,0,0.25)] px-10 py-30 flex items-center justify-center">
        <div className="w-full max-w-[650px] relative">
          {/* Avatar Circle */}
          <div className="absolute left-1/2 -top-12 -translate-x-1/2 w-24 h-24 rounded-full bg-[#00549f] flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.3)] z-10">
            <Image
              src="/chats-circle.svg"
              alt="Chat"
              width={52}
              height={52}
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>

          {/* Content Card */}
          <div className="bg-white shadow-[8px_8px_12px_rgba(0,0,0,0.25)] pt-16 px-20 pb-8">
            <div className="mb-6">
              <p className="text-[18px] leading-[1.35] text-[#222] mb-4 font-['Source_Sans_3']">
                Willkommen,
                <br />
                ich bin der Chatbot der DGUV zu dem Thema „Sicherheit und
                Gesundheit in Bildungseinrichtungen".
              </p>

              <p className="text-[18px] leading-[1.35] text-[#222] mb-4 font-['Source_Sans_3']">
                Mein Wissen basiert auf der Expertise der gesetzlichen
                Unfallversicherung. Stellen Sie mir gern Ihre Fragen! Da ich mir
                unsere Unterhaltung nicht merke, benötige ich bei Rückfragen
                genügend Kontext, um Ihre Frage gezielt beantworten zu können.
              </p>

              <p className="text-[16px] leading-[1.35] text-[#0050b5] mb-0 font-['Source_Sans_3']">
                Bitte beachten Sie:
                <br />
                Mit Beginn der Unterhaltung stimmen Sie meinen{' '}
                <a
                  href="https://dguv.de/medien/fb-bildungseinrichtungen/fb_bildung_neu/allgemeine-nutzungsbedingungen-dguv-chatbot-bildungseinrichtungen.pdf"
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
                  href="https://www.dguv.de/de/wir-ueber-uns/impressum/datenschutzerklaerung/datenschutz-bildungschat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#551A8B] underline"
                >
                  Datenschutzerklärung
                </a>
                . Ich würde mich freuen, wenn Sie mir nach unserer Unterhaltung
                ein Feedback zu Ihrer Benutzungserfahrung geben.
              </p>
            </div>

            <button
              onClick={() => router.push('/chat')}
              className="w-[320px] h-[50px] mx-auto flex items-center justify-center gap-3 bg-[#b6d900] text-black text-[20px] font-semibold cursor-pointer transition-transform hover:scale-105"
            >
              <span>Dialog starten</span>

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
          </div>
        </div>
      </div>
    </section>
  );
}