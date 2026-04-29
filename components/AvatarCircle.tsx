import Image from 'next/image';

export default function AvatarCircle() {
  return (
    <div className="absolute left-1/2 -top-12 -translate-x-1/2 w-24 h-24 rounded-full bg-[#00549f] flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.3)] z-10">
      <Image
        src="/chats-circle.svg"
        alt="Chat"
        width={52}
        height={52}
        priority
        style={{ filter: 'brightness(0) invert(1)' }}
      />
    </div>
  );
}
