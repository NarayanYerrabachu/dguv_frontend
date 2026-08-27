import BlueBoxChat from "@/components/chat/BlueBoxChat";
import ChatContent from "@/components/chat/ChatContent";

export default function ChatPage() {
  return (
    <BlueBoxChat>
      <div className="flex min-h-0 w-full flex-1 pt-8 pb-7">
        <ChatContent />
      </div>
    </BlueBoxChat>
  );
}
