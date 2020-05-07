import React from 'react'
import { FieldTemplateProps } from 'react-jsonschema-form'
import styles from './FieldTemplate.module.css'

const noLabelFields = ['root', 'root_termsAndConditions', 'root_files_0']

// Ref: https://react-jsonschema-form.readthedocs.io/en/latest/advanced-customization/#field-template
export const FieldTemplate = ({
  id,
  label,
  rawHelp,
  required,
  rawErrors,
  children
}: FieldTemplateProps) => {
  const noLabel = id !== noLabelFields.filter(f => id === f)[0]
  return (
    <section
      key={id}
      className={
        rawErrors !== undefined && rawErrors.length > 0
          ? `${styles.row} ${styles.error}`
          : `${styles.row}`
      }
    >
      <div className={styles.labelHolder}>
        {noLabel && (
          <label
            className={
              required ? `${styles.label} ${styles.req}` : styles.label
            }
            htmlFor={id}
          >
            {label}
          </label>
        )}
      </div>
      {children}

      {rawErrors && <span className={styles.errors}>{rawErrors}</span>}
      {rawHelp && <div className={styles.help}>{rawHelp}</div>}
    </section>
  )
}
