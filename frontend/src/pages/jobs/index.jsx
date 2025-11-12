import React from 'react'
import Layout from '@/components/layout'
import JobList from '@/components/list/JobList'
import LocationGrid from '@/components/list/LocationGrid'
import FaqSection from '@/components/faq/FaqSection'
import CallToAction from '@/components/common/CallToAction'

const index = () => {
  return (
   <Layout>
    <JobList/>
    <LocationGrid/>
    <FaqSection/>
     <CallToAction />
   </Layout>
  )
}

export default index   