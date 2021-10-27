import React, { ReactElement } from 'react'
import { InputProps } from '@shared/Form/Input'
import InputElement from '@shared/Form/Input/InputElement'
import styles from './Terms.module.css'

export default function Terms(props: InputProps): ReactElement {
  const termsProps: InputProps = {
    ...props,
    defaultChecked: props.value.toString() === 'true'
  }

  return (
    <>
      <InputElement {...termsProps} type="checkbox" />
    </>
  )
}
