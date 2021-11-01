import { FieldMetaProps } from 'formik'
import React, { ReactElement } from 'react'
import stylesInput from '@shared/Form/Input/index.module.css'

export default function Error({
  meta
}: {
  meta: FieldMetaProps<any>
}): ReactElement {
  return meta.error ? (
    <div className={stylesInput.error}>{meta.error}</div>
  ) : null
}
