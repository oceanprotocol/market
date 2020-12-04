import React, { ReactElement } from 'react'
import Button from '../../../atoms/Button'
import Preview from '../../../pages/Publish/Preview'
import styles from './index.module.css'

export default function Edit({
  setShowEdit
}: {
  setShowEdit: (show: boolean) => void
}): ReactElement {
  return (
    <>
      <form className={styles.form}>
        <h2>Edit Metadata</h2>

        <Button style="primary">Submit</Button>
        <Button style="text" onClick={() => setShowEdit(false)}>
          Cancel
        </Button>
      </form>
      <Preview values={{ name: 'Hello World', description: 'Hello you' }} />
    </>
  )
}
