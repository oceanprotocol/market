import React, { useEffect, useState } from 'react'
import { WidgetProps } from 'react-jsonschema-form'
import dynamic from 'next/dynamic'
import styles from './DateRangeWidget.module.css'
import { toStringNoMS } from '../../../utils'

// lazy load this module, it's huge
const LazyDatePicker = dynamic(() => import('react-datepicker'))

export function getWidgetValue(
  date1: Date,
  date2: Date,
  range: boolean
): string {
  let [initial, final] = [toStringNoMS(date1), toStringNoMS(date2)]

  if (!range) {
    final = initial
  }

  return JSON.stringify([initial, final])
}

export default function DateRangeWidget(props: WidgetProps) {
  const { onChange } = props
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [range, setRange] = useState(false)

  useEffect(() => {
    // If the range checkbox is clicked we update the value of the picker
    onChange(getWidgetValue(startDate, endDate, range))
  }, [range])

  return (
    <>
      <div className={styles.dateRange}>
        {range ? (
          <>
            <LazyDatePicker
              selected={startDate}
              onChange={(date: Date) => {
                setStartDate(date)
                onChange(getWidgetValue(date, endDate, range))
              }}
              startDate={startDate}
              selectsStart
              endDate={endDate}
            />
            <div className={styles.separator}>–</div>
            <LazyDatePicker
              selected={endDate}
              selectsEnd
              onChange={(date: Date) => {
                setEndDate(date)
                onChange(getWidgetValue(startDate, date, range))
              }}
              minDate={startDate}
              startDate={startDate}
              endDate={endDate}
            />
          </>
        ) : (
          <LazyDatePicker
            selected={startDate}
            onChange={(date: Date) => {
              setStartDate(date)
              onChange(getWidgetValue(date, date, range))
            }}
            startDate={startDate}
          />
        )}
      </div>
      <div className={styles.checkbox}>
        <input
          id="range"
          type="checkbox"
          onChange={ev => setRange(ev.target.checked)}
          checked={range}
        />
        <label className={styles.label} htmlFor="range">
          Date Range
        </label>
      </div>
    </>
  )
}
