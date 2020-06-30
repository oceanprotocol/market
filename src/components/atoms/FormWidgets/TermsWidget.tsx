import React from 'react'
import { WidgetProps } from 'react-jsonschema-form'
import styles from './TermsWidget.module.css'
import Markdown from '../Markdown'
import terms from '../../../../content/terms.md'

export default function TermsWidget(props: WidgetProps) {
  const {
    id,
    value,
    disabled,
    readonly,
    label,
    autofocus,
    onBlur,
    onFocus,
    onChange,
    required
    // DescriptionField
  } = props

  return (
    <>
      <Markdown text={terms} className={styles.terms} />
      <label
        htmlFor={id}
        className={required ? `${styles.label} ${styles.req}` : styles.label}
      >
        <input
          type="checkbox"
          id={id}
          checked={typeof value === 'undefined' ? false : value}
          disabled={disabled || readonly}
          autoFocus={autofocus}
          onChange={(event) => onChange(event.target.checked)}
          onBlur={onBlur && ((event) => onBlur(id, event.target.checked))}
          onFocus={onFocus && ((event) => onFocus(id, event.target.checked))}
        />
        <span>{label}</span>
      </label>
    </>
  )
}
