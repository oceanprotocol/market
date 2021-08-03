import React, { FormEvent, ReactElement } from 'react'
import { useOcean } from '../../../providers/Ocean'
import Button from '../../atoms/Button'
import styles from './FormActions.module.css'

export default function FormActions({
  isValid,
  resetFormAndClearStorage
}: {
  isValid: boolean
  resetFormAndClearStorage: (e: FormEvent<Element>) => void
}): ReactElement {
  const { ocean, account } = useOcean()

  return (
    <footer className={styles.actions}>
      <Button
        style="primary"
        type="submit"
        disabled={!ocean || !account || !isValid || status === 'empty'}
      >
        Submit
      </Button>

      {status !== 'empty' && (
        <Button style="text" size="small" onClick={resetFormAndClearStorage}>
          Reset Form
        </Button>
      )}
    </footer>
  )
}
