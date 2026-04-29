'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function WelcomeCard() {
  const router = useRouter();

  return (
    <div
      style={{
        width: '98vw',
        minHeight: '85vh',
        backgroundColor: '#d8eefc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.25)',
        padding: '80px 60px',
      }}
    >
      <div
        style={{
          marginTop: '30px',
          marginLeft: '30px',
          width: '100%',
          maxWidth: '900px',
          aspectRatio: '3 / 2',
          position: 'relative',
        }}
      >
        {/* Avatar Circle */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '-55px',
            transform: 'translateX(-50%)',
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            backgroundColor: '#00549f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)',
            zIndex: 10,
          }}
        >
          <Image
            src="/chats-circle.svg"
            alt="Chat"
            width={58}
            height={58}
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>

        {/* Content Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '90px 200px 50px',
            boxShadow: '8px 8px 12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <p
              style={{
                fontSize: '20px',
                lineHeight: 1.45,
                color: '#222',
                marginBottom: '1.25rem',
                fontFamily: "'Source Sans 3', Arial, sans-serif",
              }}
            >
              Willkommen,
              <br />
              ich bin der Chatbot der DGUV zu dem Thema „Sicherheit und
              Gesundheit in Bildungseinrichtungen".
            </p>

            <p
              style={{
                fontSize: '20px',
                lineHeight: 1.45,
                color: '#222',
                marginBottom: '1.25rem',
                fontFamily: "'Source Sans 3', Arial, sans-serif",
              }}
            >
              Mein Wissen basiert auf der Expertise der gesetzlichen
              Unfallversicherung. Stellen Sie mir gern Ihre Fragen! Da ich mir
              unsere Unterhaltung nicht merke, benötige ich bei Rückfragen
              genügend Kontext, um Ihre Frage gezielt beantworten zu können.
            </p>

            <p
              style={{
                fontSize: '18px',
                lineHeight: 1.45,
                color: '#0050b5',
                marginBottom: 0,
                fontFamily: "'Source Sans 3', Arial, sans-serif",
              }}
            >
              Bitte beachten Sie:
              <br />
              Mit Beginn der Unterhaltung stimmen Sie meinen{' '}
              <a
                href="https://dguv.de/medien/fb-bildungseinrichtungen/fb_bildung_neu/allgemeine-nutzungsbedingungen-dguv-chatbot-bildungseinrichtungen.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#551A8B', textDecoration: 'underline' }}
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
                style={{ color: '#551A8B', textDecoration: 'underline' }}
              >
                Datenschutzerklärung
              </a>
              . Ich würde mich freuen, wenn Sie mir nach unserer Unterhaltung
              ein Feedback zu Ihrer Benutzungserfahrung geben.
            </p>
          </div>

          {/* Start Button */}
          <button
            onClick={() => router.push('/chat')}
            style={{
              width: '360px',
              height: '55px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              margin: '0 auto',
              backgroundColor: '#b6d900',
              color: '#000',
              border: 'none',
              borderRadius: '0',
              fontSize: '22px',
              fontWeight: 600,
              fontFamily: "'Source Sans 3', Arial, sans-serif",
              cursor: 'pointer',
              transition: 'transform 0.15s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
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
              style={{
                color: '#000',
                display: 'block',
              }}
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
  );
}