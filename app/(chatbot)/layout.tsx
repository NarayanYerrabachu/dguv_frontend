import BlueBox from "@/components/BlueBox";
import ContentCard from "@/components/ContentCard";

export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BlueBox>

      {children}
    </BlueBox>
  );
}
