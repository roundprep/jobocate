import Layout from "@/components/layout";
import SEO from "@/components/seo/SEO";
import HomeHeroExact from "@/components/hero/HomeHeroExact";
import TopCompaniesHiring from "@/components/common/TopCompaniesHiring";
import ThreeStepsExact from "@/components/common/ThreeStepsExact";
import JobHuntingAutomated from "@/components/common/JobHuntingAutomated";
import CompleteAISystemExact from "@/components/common/CompleteAISystemExact";
import AIFeaturedCards from "@/components/common/AIFeaturedCards";
import PricingExact from "@/components/common/PricingExact";
import TestimonialSection from "@/components/testimonial/TestimonialSection";
import EmployerCTAExact from "@/components/common/EmployerCTAExact";
import ScrollingBanner from "@/components/common/ScrollingBanner";

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
        <CompleteAISystemExact />
        <AIFeaturedCards />
        <PricingExact />
        <TestimonialSection />
        <EmployerCTAExact />
        <ScrollingBanner />
      </Layout>
    </>
  );
}
