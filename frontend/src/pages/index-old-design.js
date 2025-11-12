import Layout from "@/components/layout";
import SEO from "@/components/seo/SEO";
import HomeHeroExact from "@/components/hero/HomeHeroExact";
import TopCompaniesHiring from "@/components/common/TopCompaniesHiring";
import ThreeStepsExact from "@/components/common/ThreeStepsExact";
import JobHuntingAutomated from "@/components/common/JobHuntingAutomated";
import CompleteAISystem from "@/components/common/CompleteAISystem";
import AIDrivenSection from "@/components/common/AIDrivenSection";
import PricingSectionNew from "@/components/common/PricingSectionNew";
import TestimonialQuote from "@/components/common/TestimonialQuote";
import EmployerCTA from "@/components/common/EmployerCTA";
import RotatingBanner from "@/components/common/RotatingBanner";

export default function Home() {
  return (
    <>
      <SEO 
        title="JOBOCATE - AI-Powered Job Applications"
        description="AI-Powered Reach. Human-Smart Precision. 10x Faster Job Applications"
      />
      <Layout>
        <HomeHeroExact />
        <TopCompaniesHiring />
        <ThreeStepsExact />
        <JobHuntingAutomated />
        <CompleteAISystem />
        <AIDrivenSection />
        <PricingSectionNew />
        <TestimonialQuote />
        <EmployerCTA />
        <RotatingBanner />
      </Layout>
    </>
  );
}
