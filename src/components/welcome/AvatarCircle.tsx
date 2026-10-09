import Image from 'next/image';

export default function AvatarCircle() {
  return (
    <div className="absolute left-1/2 -top-10 sm:-top-14 -translate-x-1/2 w-20 h-20 sm:w-29 sm:h-29 rounded-full
     bg-[#004994] flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.4)] z-10">
      <Image
        src="/chats-circle.svg"
        alt="Chat"
        width={58}
        height={58}
        priority
        className="brightness-0 invert w-9 h-9 sm:w-[58px] sm:h-[58px]"
      />
    </div>
  );
}
