import BlueBoxChat from "@/components/BlueBoxChat";
import ChatContent from "@/components/chat/ChatContent";

export default function ChatPage() {
  return (
    <BlueBoxChat>
      <div className="flex min-h-0 w-[88vw] flex-1 pt-12 pb-7">
        <ChatContent />
      </div>
    </BlueBoxChat>
  );
}
