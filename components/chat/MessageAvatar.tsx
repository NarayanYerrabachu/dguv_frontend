interface MessageAvatarProps {
  role: "user" | "assistant";
}

export default function MessageAvatar({ role }: MessageAvatarProps) {
  return (
    <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-[#004994]">
      <span className="text-lg font-semibold text-white font-['Source_Sans_3',ui-sans-serif,system-ui,sans-serif]">
        {role === "user" ? "U" : "A"}
      </span>
    </div>
  );
}
