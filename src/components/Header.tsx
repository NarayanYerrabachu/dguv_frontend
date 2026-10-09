'use client';

import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-26 bg-white flex items-center z-50 pr-4 sm:pr-8">
      <div className="ml-4 sm:ml-[61px] -mt-1">
        <Image
          src="/logo-dguv-rgb.svg"
          alt="DGUV – Deutsche Gesetzliche Unfallversicherung"
          width={308}
          height={66}
          priority
          className="h-[44px] sm:h-[66px] w-auto"
        />
      </div>
    </header>
  );
}
