import React, { ReactElement, useEffect, useState } from 'react'
import { format, formatDistance } from 'date-fns'

export interface TimeProps {
  date: string
  relative?: boolean
  isUnix?: boolean
  displayFormat?: string
  className?: string
}

export default function Time({
  date,
  relative,
  isUnix,
  displayFormat,
  className
}: TimeProps): ReactElement {
  const [dateIso, setDateIso] = useState<string>()
  const [dateNew, setDateNew] = useState<Date>()

  useEffect(() => {
    if (!date) return

    const dateNew = isUnix ? new Date(Number(date) * 1000) : new Date(date)
    setDateIso(dateNew.toISOString())
    setDateNew(dateNew)
  }, [date, isUnix])

  return !dateIso || !dateNew ? (
    <></>
  ) : (
    <time
      title={format(dateNew, displayFormat || 'PPppp')}
      dateTime={dateIso}
      className={className || undefined}
    >
      {relative
        ? formatDistance(dateNew, Date.now(), { addSuffix: true })
        : format(dateNew, displayFormat || 'PP')}
    </time>
  )
}
