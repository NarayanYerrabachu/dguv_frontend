'use client';

export default function Footer() {
  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--footer-height)',
        backgroundColor: '#004994',
        padding: '0.75rem 1.5rem 0.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        zIndex: 100,
      }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <a
          href="https://dguv.de/de/wir-ueber-uns/impressum/index.jsp"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontFamily: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif",
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
        >
          Impressum
        </a>
        <span
          style={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.875rem',
            userSelect: 'none',
          }}
        >
          •
        </span>
        <a
          href="https://www.dguv.de/de/wir-ueber-uns/impressum/datenschutzerklaerung/datenschutz-bildungschat"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontFamily: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif",
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
        >
          Datenschutz
        </a>
        <span
          style={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.875rem',
            userSelect: 'none',
          }}
        >
          •
        </span>
        <a
          href="https://dguv.de/medien/fb-bildungseinrichtungen/fb_bildung_neu/allgemeine-nutzungsbedingungen-dguv-chatbot-bildungseinrichtungen.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontFamily: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif",
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
        >
          Nutzungsbedingungen
        </a>
      </nav>
    </footer>
  );
}
