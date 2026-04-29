'use client';

import Image from 'next/image';

export default function Header() {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--header-height)',
        backgroundColor: '#ffffff',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: '40px',
          marginTop: '40px',
        }}
      >
        <Image
          src="/logo-dguv-rgb.svg"
          alt="DGUV – Deutsche Gesetzliche Unfallversicherung"
          width={120}
          height={40}
          priority
          style={{
            height: '70px',
            width: 'auto',
          }}
        />
      </div>
    </header>
  );
}
