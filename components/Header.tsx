'use client';

import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-26 bg-white px-6 flex items-center z-50">
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
    </header>
  );
}