import React from 'react'
import Layout from '@/components/layout'
import ContactUs from '@/components/form/ContactUs'
import CallToAction from '@/components/common/CallToAction'
import ContactHeader from '@/components/header/ContactHeader'
import ContactCards from '@/components/cards/ContactCards'

const index = () => {
  return (
   <Layout>
    <ContactHeader/>
    <ContactUs/>
    <ContactCards/>
    <CallToAction/>
   </Layout>
  )
}

export default index