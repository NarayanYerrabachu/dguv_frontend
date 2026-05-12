'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white px-6 flex items-center justify-between z-50">
      <div className="ml-10 flex items-center">
        <Image
          src="/logo-dguv-rgb.svg"
          alt="DGUV – Deutsche Gesetzliche Unfallversicherung"
          width={120}
          height={40}
          priority
          className="h-16 w-auto"
        />
      </div>

      <div className="mr-10 flex items-center gap-1 rounded-lg border border-[#c8d3df] p-1">
        <button
          onClick={() => setLanguage('de')}
          className={`px-3 py-1 rounded-md text-sm font-semibold font-['Source_Sans_3'] transition-colors ${
            language === 'de'
              ? 'bg-[#004994] text-white'
              : 'text-[#004994] hover:bg-[#d8eefc]'
          }`}
        >
          DE
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 rounded-md text-sm font-semibold font-['Source_Sans_3'] transition-colors ${
            language === 'en'
              ? 'bg-[#004994] text-white'
              : 'text-[#004994] hover:bg-[#d8eefc]'
          }`}
        >
          EN
        </button>
      </div>
    </header>
  );
}
