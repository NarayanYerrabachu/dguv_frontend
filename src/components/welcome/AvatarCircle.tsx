import Image from 'next/image';

export default function AvatarCircle() {
  return (
    <div className="absolute left-1/2 -top-12 -translate-x-1/2 w-24 h-24 rounded-full bg-[#004994] flex items-center justify-center shadow-[rgba(0,0,0,0.23)_7px_7px_5px_0px] z-10">
      <Image
        src="/chats-circle.svg"
        alt="Chat"
        width={50}
        height={46}
        priority
        className="brightness-0 invert"
      />
    </div>
  );
}
