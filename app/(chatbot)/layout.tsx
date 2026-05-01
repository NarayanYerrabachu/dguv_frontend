import BlueBox from "@/components/BlueBox";
import FeedbackButton from "@/components/FeedbackButton";

export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BlueBox>
      <div className="flex min-h-0 flex-1 flex-col">
        {children}
      </div>

      <FeedbackButton />
    </BlueBox>
  );
}