import React, { ReactElement } from 'react'
import { format, formatDistance } from 'date-fns'

export default function Time({
  date,
  relative,
  isUnix,
  className
}: {
  date: string
  relative?: boolean
  isUnix?: boolean
  className?: string
}): ReactElement {
  const dateNew = isUnix ? new Date(Number(date) * 1000) : new Date(date)
  const dateIso = dateNew.toISOString()

  return !date ? (
    <></>
  ) : (
    <time
      title={relative ? format(dateNew, 'MMMM d, yyyy') : undefined}
      dateTime={dateIso}
      className={className || undefined}
    >
      {relative
        ? formatDistance(dateNew, Date.now(), { addSuffix: true })
        : format(dateNew, 'MMMM d, yyyy')}
    </time>
  )
}
