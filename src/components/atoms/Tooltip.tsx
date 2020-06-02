import React, { ReactElement, forwardRef } from 'react'
import Tippy from '@tippyjs/react'

export default function Tooltip({
  content,
  children
}: {
  content: string
  children: ReactElement
}) {
  return (
    <Tippy content={content}>
      <CustomWrapper>{children}</CustomWrapper>
    </Tippy>
  )
}

// Forward ref for Tippy.js
// eslint-disable-next-line
const CustomWrapper = forwardRef(
  ({ children }: { children: ReactElement }, ref: any) => {
    return <div ref={ref}>{children}</div>
  }
)
