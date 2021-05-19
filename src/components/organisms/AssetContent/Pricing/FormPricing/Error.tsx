import { FieldMetaProps } from 'formik'
import React, { ReactElement } from 'react'
import { error } from '../../../../atoms/Input/index.module.css'

export default function Error({
  meta
}: {
  meta: FieldMetaProps<any>
}): ReactElement {
  return meta.error ? <div className={error}>{meta.error}</div> : null
}
