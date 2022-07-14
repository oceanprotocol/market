import React, { ReactElement, ReactNode } from 'react'
import '@github/markdown-toolbar-element'
import styles from './InputMarkdown.module.css'

interface InputMarkdownProps {
  name: string
  children: ReactNode
}

export default function InputMarkdown({
  name,
  children
}: InputMarkdownProps): ReactElement {
  return (
    <>
      <div className={styles.markdownToolbarContainer}>
        <markdown-toolbar for={name} class={styles.markdownToolbar}>
          <md-bold>bold</md-bold>
          <md-header>header</md-header>
          <md-italic>italic</md-italic>
          <md-quote>quote</md-quote>
          <md-code>code</md-code>
          <md-link>link</md-link>
          <md-image>image</md-image>
          <md-unordered-list>unordered-list</md-unordered-list>
          <md-ordered-list>ordered-list</md-ordered-list>
          <md-task-list>task-list</md-task-list>
          <md-mention>mention</md-mention>
          <md-ref>ref</md-ref>
        </markdown-toolbar>
      </div>
      {children}
    </>
  )
}
