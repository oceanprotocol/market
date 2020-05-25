import React from 'react'
import Time from '../Time'

export default function DateCell({ date }: { date: any }) {
  console.log(date)
  return date && <Time date={date} />
}
