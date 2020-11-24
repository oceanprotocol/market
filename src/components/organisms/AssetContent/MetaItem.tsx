import React, { ReactElement, ReactNode } from 'react'
import { MetaTimeout } from '../../molecules/FormFields/DurationInput'
import styles from './MetaItem.module.css'

function MetaObject({ content, type }: { content: any; type?: string }) {
  if (type) {
    switch (type) {
      case 'accessTimeout':
      case 'computeTimeout':
        return <MetaTimeout content={content} />
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
  type
}: {
  title: string
  content: any // ReactNode
  type?: string
}): ReactElement {
  return (
    <div className={styles.metaItem}>
      <h3 className={styles.title}>{title}</h3>
      {typeof content === 'object' && type ? (
        <MetaObject content={content} type={type} />
      ) : (
        content
      )}
    </div>
  )
}
