import { markdownToHtml } from '@utils/markdown'
import React, { ReactElement } from 'react'
import styles from './index.module.css'

export interface MarkdownProps {
  text: string
  className?: string
}

const Markdown = ({ text, className }: MarkdownProps): ReactElement => {
  const content = markdownToHtml(text)

  return (
    <div
      className={`${styles.markdown} ${className}`}
      // Note: We serialize and kill all embedded HTML over in markdownToHtml()
      // so the danger here is gone.
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default Markdown
