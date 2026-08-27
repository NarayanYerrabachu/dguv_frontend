import FeedbackButton from "@/components/FeedbackButton";

export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <FeedbackButton />
    </>
  );
}
