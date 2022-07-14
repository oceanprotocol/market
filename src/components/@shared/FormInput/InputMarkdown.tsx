import React, { ReactElement, ReactNode } from 'react'
import '@github/markdown-toolbar-element'
import styles from './InputMarkdown.module.css'

// Icons
import IconB from '@images/markdown/bold.svg'
import IconH from '@images/markdown/heading.svg'
import IconI from '@images/markdown/italic.svg'
import IconQ from '@images/markdown/quote.svg'
import IconC from '@images/markdown/code.svg'
import IconL from '@images/markdown/link.svg'
import IconImg from '@images/markdown/image.svg'
import IconUL from '@images/markdown/list-unordered.svg'
import IconOL from '@images/markdown/list-ordered.svg'
import IconTL from '@images/markdown/task-list.svg'
import IconM from '@images/markdown/mention.svg'
import IconT from '@images/markdown/tag.svg'

interface InputMarkdownProps {
  name: string
  children: ReactNode
  markdownToolbar?: boolean
}

export default function InputMarkdown({
  name,
  children,
  markdownToolbar
}: InputMarkdownProps): ReactElement {
  return (
    <>
      {markdownToolbar && (
        <div className={styles.markdownToolbarContainer}>
          <markdown-toolbar for={name} class={styles.markdownToolbar}>
            <md-bold>
              <IconB className={styles.icon} />
            </md-bold>
            <md-header>
              <IconH className={styles.icon} />
            </md-header>
            <md-italic>
              <IconI className={styles.icon} />
            </md-italic>
            <md-quote>
              <IconQ className={styles.icon} />
            </md-quote>
            <md-code>
              <IconC className={styles.icon} />
            </md-code>
            <md-link>
              <IconL className={styles.icon} />
            </md-link>
            <md-image>
              <IconImg className={styles.icon} />
            </md-image>
            <md-unordered-list>
              <IconUL className={styles.icon} />
            </md-unordered-list>
            <md-ordered-list>
              <IconOL className={styles.icon} />
            </md-ordered-list>
            <md-task-list>
              <IconTL className={styles.icon} />
            </md-task-list>
            <md-mention>
              <IconM className={styles.icon} />
            </md-mention>
            <md-ref>
              <IconT className={styles.icon} />
            </md-ref>
          </markdown-toolbar>
        </div>
      )}
      {children}
    </>
  )
}
