import { LINKS } from "@/lib/links";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-25 bg-[#004994] flex items-center px-[113px] z-50">
      <nav className="flex items-center gap-0 flex-wrap">
        <a href={LINKS.impressum} target="_blank" rel="noopener noreferrer" className="text-white text-[16px] transition-colors duration-200 hover:text-gray-300 hover:underline">
          Impressum
        </a>
        <span className="text-white/60 text-[12px] mx-[8px]">·</span>
        <a href={LINKS.datenschutz} target="_blank" rel="noopener noreferrer" className="text-white text-[16px] transition-colors duration-200 hover:text-gray-300 hover:underline">
          Datenschutz
        </a>
        <span className="text-white/60 text-[12px] mx-[8px]">·</span>
        <a href={LINKS.nutzungsbedingungen} target="_blank" rel="noopener noreferrer" className="text-white text-[16px] transition-colors duration-200 hover:text-gray-300 hover:underline">
          Nutzungsbedingungen
        </a>
      </nav>
    </footer>
  );
}
