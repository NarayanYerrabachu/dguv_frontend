import Image from 'next/image';

export default function FeedbackButton() {
  return (
    <a
      href="https://befragungen.dguv.de/evasys/online.php?p=Chatbotfeedback_2026"
      target="_blank"
      rel="noopener noreferrer"
      title="Feedback geben"
      className="group fixed right-4 top-1/2 -translate-y-1/2 w-18 h-23 border border-[#c8d3df] rounded-lg flex flex-col items-center justify-center gap-2 no-underline cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.10)] transition-all duration-200 ease-in-out z-50 bg-white hover:bg-[#004994]"
    >
      <Image
        src="/note-pencil.svg"
        alt="Feedback"
        width={34}
        height={34}
        className="w-[34px] h-[34px] group-hover:brightness-0 group-hover:invert"
      />
      <span className="text-sm font-normal font-['Source_Sans_3',Arial,sans-serif] text-[#004994] group-hover:text-white">
        Feedback
      </span>
    </a>
  );
}
