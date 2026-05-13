import { LINKS } from "@/lib/links";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-22 bg-[#004994] px-6 flex items-center z-50">
      <nav className="flex items-center gap-2 flex-wrap">
        <a href={LINKS.impressum} target="_blank" rel="noopener noreferrer" className="text-white/90 text-sm hover:underline">
          Impressum
        </a>

        <span className="text-white/50 text-sm">•</span>

        <a href={LINKS.datenschutz} target="_blank" rel="noopener noreferrer" className="text-white/90 text-sm hover:underline">
          Datenschutz
        </a>

        <span className="text-white/50 text-sm">•</span>

        <a href={LINKS.nutzungsbedingungen} target="_blank" rel="noopener noreferrer" className="text-white/90 text-sm hover:underline">
          Nutzungsbedingungen
        </a>
      </nav>
    </footer>
  );
}