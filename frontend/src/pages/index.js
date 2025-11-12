import Layout from "@/components/layout";
import SEO from "@/components/seo/SEO";
import HomeHero from "@/components/hero/HomeHero";
import JobListings from "@/components/list/JobListings";
import FaqSection from "@/components/faq/FaqSection";
import WhyUs from "@/components/common/WhyUs";
import BlogSection from "@/components/Blog/BlogSection";
import CallToAction from "@/components/common/CallToAction";
import TestimonialSection from "@/components/testimonial/TestimonialSection";
import JobAutomation from "@/components/common/JobAutomation";
import CompaniesHiring from "@/components/common/CompaniesHiring";
import TalentJobs from "@/components/common/TalentJobs";
import AIJobSearchSteps from "@/components/common/AIJobSearchSteps";
import SectionOverviewSection from "@/components/common/SectionOverviewSection";
import PricingSection from "@/components/common/PricingSection";

export default function Home() {
  return (
    <>
      <SEO 
        title="JobOcate - Find Your Dream Job with AI-Powered Job Search"
        description="Discover your next career opportunity with JobOcate. AI-powered job search platform connecting talented professionals with top companies. Find jobs that match your skills and preferences."
        keywords="job search, careers, employment, jobs, hiring, job portal, AI jobs, tech jobs"
      />
      <Layout>
      <HomeHero />
      <CompaniesHiring />
      <AIJobSearchSteps />
      <JobAutomation />
      <SectionOverviewSection />
      <FaqSection />
      <WhyUs />
      <TalentJobs />

      {/* <JobListings /> */}
      <PricingSection />

      
      {/* <BlogSection /> */}
      <CallToAction />
      <TestimonialSection />
    </Layout>
    </>
  );
}
