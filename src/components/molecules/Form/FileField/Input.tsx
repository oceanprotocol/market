import React, { ReactElement, ReactNode } from 'react'
import isUrl from 'is-url-superb'
import Loader from '../../../atoms/Loader'
import Button from '../../../atoms/Button'
import styles from './index.module.css'

const FileInput = ({
  formData,
  handleButtonClick,
  isLoading,
  children,
  i
}: {
  children: ReactNode
  i: number
  formData: string[]
  handleButtonClick(e: React.SyntheticEvent, data: string): void
  isLoading: boolean
}): ReactElement => (
  <>
    {children}
    {formData[i] && (
      <Button
        className={styles.addButton}
        onClick={(e: React.SyntheticEvent) => handleButtonClick(e, formData[i])}
        disabled={!isUrl(formData[i])}
      >
        {isLoading ? <Loader /> : 'Add File'}
      </Button>
    )}
  </>
)

export default FileInput
