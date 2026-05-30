import BlueBox from "@/components/BlueBox";
import FeedbackButton from "@/components/FeedbackButton";

export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BlueBox>
      {/* pt=67px matches live: card starts 67px from top of blue area */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center -mt-[20px]">
        {children}
      </div>
      <FeedbackButton />
    </BlueBox>
  );
}
