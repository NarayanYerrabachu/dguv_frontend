'use client';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-20 bg-[#004994] px-6 flex items-center z-50">
      <nav className="flex items-center gap-2 flex-wrap">
        <a
          href="https://dguv.de/de/wir-ueber-uns/impressum/index.jsp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/90 text-sm hover:underline"
        >
          Impressum
        </a>

        <span className="text-white/50 text-sm">•</span>

        <a
          href="https://www.dguv.de/de/wir-ueber-uns/impressum/datenschutzerklaerung/datenschutz-bildungschat"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/90 text-sm hover:underline"
        >
          Datenschutz
        </a>

        <span className="text-white/50 text-sm">•</span>

        <a
          href="https://dguv.de/medien/fb-bildungseinrichtungen/fb_bildung_neu/allgemeine-nutzungsbedingungen-dguv-chatbot-bildungseinrichtungen.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/90 text-sm hover:underline"
        >
          Nutzungsbedingungen
        </a>
      </nav>
    </footer>
  );
}