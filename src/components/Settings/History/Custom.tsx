import { Field, useFormikContext } from 'formik'
import Input from '@shared/FormInput'
import React, { ReactElement, useState } from 'react'
import { FormSettingsData } from '../_types'
import { getFieldContent } from '../_utils'
import styles from './Custom.module.css'
import contentAsset from '../../../../content/settings/custom.json'
import Button from '@shared/atoms/Button'
export function Custom({ assets }: { assets: any }): ReactElement {
  const { values } = useFormikContext<FormSettingsData>()


export function Custom(): ReactElement {
  const [open, setOpen] = useState(false)

  const itemsClosed = (index: any) => (
    <div
      onClick={() => {
        setOpen(!open)
      }}
    >
      <li key={index} className={styles.customTitle}>
        <h3>Add Custom Signal</h3>
      </li>
    </div>
  )

  const itemsOpened = (index: any) => (
    <li key={index}>
      <h3>add custom signal</h3>
      <section className={styles.section}>
        <div className={styles.sectionElements}>
          <p>Signal Name</p>
        </div>
        <div className={styles.sectionElementsRight}>
          <Field
            className={styles.display}
            {...getFieldContent('type', [])}
            component={Input}
            name="title"
          />
          <p>TEXT</p>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionElements}>
          <p>API URL</p>
        </div>
        <div className={styles.sectionElementsRight}>
          <Field
            className={styles.display}
            {...getFieldContent('type', [])}
            component={Input}
            name="origin"
          />
          <p>TEXT</p>
          <div className={styles.sectionElementsBtn}>
            <Button style="primary">add signal</Button>
            <Button
              style="primary"
              onClick={() => {
                setOpen(!open)
              }}
            >
              cancel
            </Button>
          </div>
        </div>
      </section>
    </li>
  )

  return (
    <ol className={styles.custom}>
      {open ? itemsClosed(!open) : itemsOpened(!open)}
    </ol>
  )
}
