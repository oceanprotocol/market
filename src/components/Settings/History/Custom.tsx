import { Field } from 'formik'
import Input from '@shared/FormInput'
import React, { ReactElement, useState } from 'react'
import { getFieldContent } from '../_utils'
import styles from './Custom.module.css'
import Button from '@shared/atoms/Button'

export function Custom(): ReactElement {
  const [open, setOpen] = useState(false)
  const itemsClosed = (index: any) => (
    <div
      onClick={() => {
        setOpen(!open)
      }}
    >
      <li key={index} className={styles.customTitle}>
        <h3>ADD CUSTOM SIGNAL</h3>
      </li>
    </div>
  )

  const itemsOpened = (index: any) => (
    <li key={index}>
      <h3>Add custom signal</h3>
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
          <p>
            Enter a concise name, this name will be used to manege your signials
            settings
          </p>
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
          <p>
            Enter the URL of the API endpoint which you want to add. The URL
            must contain the placeholder <b>$assetid</b> in order to pass to the
            API the reference of the data asset. Optionally you can also use
            <b>$userAccount</b> if the API needs the address of the connected
            user to compute the signal value and <b>$publisherId</b> in order to
            pass a reference of the publisher.
          </p>
          <div className={styles.sectionElementsBtn}>
            <Button type={'submit'} style="primary">
              add signal
            </Button>
            <Button
              style="primary"
              className={styles.btnCancel}
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
