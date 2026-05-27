import Image from 'next/image';
import { LINKS } from '@/lib/links';

export default function FeedbackButton() {
  return (
    <a
      href={LINKS.feedback}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Feedback geben"
      title="Feedback geben"
      className="group fixed right-1 top-1/2 -translate-y-1/2 w-20 h-23 border 
      border-[#c8d3df] rounded-lg flex flex-col items-center justify-center 
      gap-2 no-underline cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.10)] 
      transition-all duration-200 ease-in-out z-50 bg-white hover:bg-[#004994]"
    >
      <Image
        src="/note-pencil.svg"
        alt="Feedback"
        width={38}
        height={38}
        className="w-10 h-10 group-hover:brightness-0 group-hover:invert"
      />
      <span className="text-xs font-normal text-[#004994] group-hover:text-white">
        Feedback
      </span>
    </a>
  );
}
