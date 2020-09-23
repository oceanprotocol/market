import React, { ReactElement } from 'react'
import { format, formatDistance } from 'date-fns'

export default function Time({
  date,
  relative
}: {
  date: string
  relative?: boolean
}): ReactElement {
  const dateNew = new Date(date)
  const dateIso = dateNew.toISOString()

  return (
    <time
      title={relative ? format(dateNew, 'MMMM d, yyyy') : undefined}
      dateTime={dateIso}
    >
      {relative
        ? formatDistance(dateNew, Date.now(), { addSuffix: true })
        : format(dateNew, 'MMMM d, yyyy')}
    </time>
  )
}
