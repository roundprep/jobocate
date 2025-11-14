import * as Headless from '@headlessui/react'
import NextLink from 'next/link'
import React, { forwardRef } from 'react'

export const Link = forwardRef(function Link({ href, ...props }, ref) {
  return (
    <Headless.DataInteractive>
      {href ? (
        <NextLink href={href} {...props} ref={ref} />
      ) : (
        <a {...props} ref={ref} />
      )}
    </Headless.DataInteractive>
  )
})
