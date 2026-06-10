import BlueBoxWelcome from "@/components/welcome/BlueBoxWelcome";
import ContentCard from "@/components/welcome/ContentCard";
import WelcomeContent from "@/components/welcome/WelcomeContent";

export default function WelcomePage() {
  return (
    <BlueBoxWelcome>
      <div className="flex min-h-0 flex-1 flex-col items-center pt-16">
        <div className="my-auto">
          <ContentCard>
            <WelcomeContent />
          </ContentCard>
        </div>
      </div>
    </BlueBoxWelcome>
  );
}
