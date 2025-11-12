import Layout from "@/components/layout";
import SEO from "@/components/seo/SEO";
import HomeHero from "@/components/hero/HomeHeroNew";
import TopCompanies from "@/components/common/TopCompanies";
import ThreeSteps from "@/components/common/ThreeSteps";
import JobHuntingAutomated from "@/components/common/JobHuntingAutomated";
import CompleteAISystem from "@/components/common/CompleteAISystem";
import FAQSection from "@/components/faq/FAQSection";
import MobileAppShowcase from "@/components/common/MobileAppShowcase";
import AIDrivenSection from "@/components/common/AIDrivenSection";
import PricingSection from "@/components/common/PricingSectionNew";
import TestimonialQuote from "@/components/common/TestimonialQuote";
import EmployerCTA from "@/components/common/EmployerCTA";
import RotatingBanner from "@/components/common/RotatingBanner";

export default function Home() {
  return (
    <>
      <SEO 
        title="JobOcate - AI-Powered Job Search Platform"
        description="AI-Powered Reach. Human-Smart Precision. 10x Faster Job Applications"
        keywords="job search, AI jobs, automated job applications, career platform"
      />
      <Layout>
        <HomeHero />
        <TopCompanies />
        <ThreeSteps />
        <JobHuntingAutomated />
        <CompleteAISystem />
        <FAQSection />
        <MobileAppShowcase />
        <AIDrivenSection />
        <PricingSection />
        <TestimonialQuote />
        <EmployerCTA />
        <RotatingBanner />
      </Layout>
    </>
  );
}
