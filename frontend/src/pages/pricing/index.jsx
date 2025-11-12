import React from 'react'
import Layout from '@/components/layout'
import PricingSection from '@/components/common/PricingSection'
import FaqSection from '@/components/faq/FaqSection'
import CallToAction from '@/components/common/CallToAction'
const Pricing = () => {
  return (
    <Layout>
         <PricingSection />
         <FaqSection />
         <CallToAction />
    </Layout>
  )
}

export default Pricing