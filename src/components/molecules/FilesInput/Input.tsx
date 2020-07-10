import React, { ReactElement } from 'react'
import isUrl from 'is-url-superb'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import { useField, FormikProps } from 'formik'
import { File } from '@oceanprotocol/squid'

export default function FileInput({
  handleButtonClick,
  ...props
}: {
  handleButtonClick(e: React.SyntheticEvent, data: string): void
  props: FormikProps<File>
}): ReactElement {
  const [field, meta, helpers] = useField(props)
  console.log(field)

  return (
    <>
      <Input type="url" name="url" placeholder="e.g." {...field} />

      <Button
        size="small"
        onClick={(e: React.SyntheticEvent) => handleButtonClick(e, field.value)}
        // disabled={!isUrl(field && field.value)}
      >
        Add File
      </Button>
    </>
  )
}
