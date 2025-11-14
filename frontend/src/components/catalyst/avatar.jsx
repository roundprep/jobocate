import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef } from 'react'
import { TouchTarget } from './button'
import { Link } from './link'

export function Avatar({ src = null, square = false, initials, alt = '', className, ...props }) {
  const hasSrc = src && src !== 'null' && src !== '';
  const showInitials = !hasSrc && (initials || 'U');
  const displayInitials = initials || 'U';
  
  return (
    <span
      data-slot="avatar"
      {...props}
      className={clsx(
        className,
        // Basic layout
        'inline-grid shrink-0 align-middle [--avatar-radius:20%] *:col-start-1 *:row-start-1',
        'outline -outline-offset-1 outline-black/10 dark:outline-white/10',
        // Border radius
        square ? 'rounded-(--avatar-radius) *:rounded-(--avatar-radius)' : 'rounded-full *:rounded-full',
        // Background for initials - always show background if no image
        showInitials && 'bg-blue-500 dark:bg-blue-600',
        // Size fallback - ensure size is always set
        (!className || !className.includes('size-')) && 'size-8'
      )}
      style={{ minWidth: '2rem', minHeight: '2rem' }}
    >
      {showInitials && (
        <svg
          className="size-full fill-current p-[5%] text-white font-bold uppercase select-none"
          viewBox="0 0 100 100"
          aria-hidden={alt ? undefined : 'true'}
        >
          {alt && <title>{alt}</title>}
          <text x="50%" y="50%" alignmentBaseline="middle" dominantBaseline="middle" textAnchor="middle" dy=".125em" fontSize="48" fill="white">
            {displayInitials}
          </text>
        </svg>
      )}
      {hasSrc && <img className="size-full object-cover rounded-full" src={src} alt={alt} />}
    </span>
  )
}

export const AvatarButton = forwardRef(function AvatarButton(
  { src, square = false, initials, alt, className, ...props },

  ref
) {
  let classes = clsx(
    className,
    square ? 'rounded-[20%]' : 'rounded-full',
    'relative inline-grid focus:not-data-focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500',
    'flex-shrink-0'
  )

  return typeof props.href === 'string' ? (
    <Link {...props} className={classes} ref={ref}>
      <TouchTarget>
        <Avatar src={src} square={square} initials={initials} alt={alt} className={className} />
      </TouchTarget>
    </Link>
  ) : (
    <Headless.Button {...props} className={classes} ref={ref}>
      <TouchTarget>
        <Avatar src={src} square={square} initials={initials} alt={alt} className={className} />
      </TouchTarget>
    </Headless.Button>
  )
})
