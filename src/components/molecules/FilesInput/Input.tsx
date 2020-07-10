import React, { ReactElement } from 'react'
import isUrl from 'is-url-superb'
import Button from '../../atoms/Button'
import { useField } from 'formik'
import Loader from '../../atoms/Loader'
import InputElement from '../../atoms/Input/InputElement'

export default function FileInput({
  handleButtonClick,
  isLoading,
  ...props
}: {
  handleButtonClick(e: React.SyntheticEvent, data: string): void
  isLoading: boolean
}): ReactElement {
  const [field] = useField(props as any)

  return (
    <>
      <InputElement {...field} {...props} type="url" />

      <Button
        size="small"
        onClick={(e: React.SyntheticEvent) => handleButtonClick(e, field.value)}
        disabled={!field.value || !isUrl(field.value)}
      >
        {isLoading ? <Loader /> : 'Add File'}
      </Button>
    </>
  )
}
