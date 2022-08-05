import { Field } from 'formik'
import Input from '@shared/FormInput'
import React, { ReactElement, useState } from 'react'
import styles from './Custom.module.css'

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
      <h3>Add Custom Signal</h3>
      <section className={styles.section}>
        <div className={styles.sectionElements}>
          <p>Signal Name</p>
        </div>
        <div className={styles.sectionElements}>
          <Field className={styles.display} component={Input} name="title" />
          <p>
            Enter a concise name, this name will be used to manege your signals
            settings
          </p>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionElements}>
          <p>API URL</p>
        </div>
        <div className={styles.sectionElements}>
          <Field className={styles.display} component={Input} name="origin" />
          <p>
            Enter the URL of the API endpoint which you want to add. The URL
            must contain the placeholder <b>$assetid</b> in order to pass to the
            API the reference of the data asset. Optionally you can also use{' '}
            <b>$usersaddress</b> if the API needs the address of the connected
            user to compute the signal value and <b>$accountid</b> in order to
            pass a reference of the publisher.
          </p>
          <div className={styles.sectionElements}>
            <button type="submit">add signal</button>
            <button
              onClick={() => {
                setOpen(!open)
              }}
            >
              cancel
            </button>
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
