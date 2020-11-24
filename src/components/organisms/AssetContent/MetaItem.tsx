import React, { ReactElement, ReactNode } from 'react'
import { FormFieldProps } from '../../../@types/Form'
import { MetaTimeout } from '../../molecules/FormFields/DurationInput'
import styles from './MetaItem.module.css'

function MetaObject({
  content,
  type,
  data
}: {
  content: any
  type?: string
  data?: FormFieldProps[]
}) {
  if (type) {
    switch (type) {
      case 'accessTimeout':
      case 'computeTimeout':
        return (
          <MetaTimeout
            content={content}
            data={data.find((field) => field.name === type)}
          />
        )
    }
  }
  return (
    <>
      {Object.keys(content)
        .map((key) => `${content[key]} ${key}`)
        .join(', ')}
    </>
  )
}

export default function MetaItem({
  title,
  content,
  type,
  data
}: {
  title: string
  content: any // ReactNode
  type?: string
  data?: FormFieldProps[]
}): ReactElement {
  return (
    <div className={styles.metaItem}>
      <h3 className={styles.title}>{title}</h3>
      {typeof content === 'object' && type ? (
        <MetaObject content={content} type={type} data={data} />
      ) : (
        content
      )}
    </div>
  )
}
