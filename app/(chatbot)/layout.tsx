import BlueBox from "@/components/BlueBox";
import ContentCard from "@/components/ContentCard";
import FeedbackButton from "@/components/FeedbackButton";

export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BlueBox>
      {children}
      <FeedbackButton/>
    </BlueBox>
  );
}
