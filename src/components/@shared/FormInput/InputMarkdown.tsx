import React, { ReactElement } from 'react'
import { useFormikContext } from 'formik'
import { FormPublishData } from '../../Publish/_types'
import dynamic from 'next/dynamic'
import styles from './InputMarkdown.module.css'
import {
  bold,
  code,
  codeBlock,
  italic,
  link,
  unorderedListCommand,
  orderedListCommand,
  checkedListCommand,
  quote,
  hr,
  title,
  title1,
  title2,
  title3,
  title4,
  title5,
  title6,
  divider,
  image,
  strikethrough,
  codeEdit,
  codePreview
} from '@uiw/react-md-editor/lib/commands'

import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const InputMarkdown = ({ ...props }): ReactElement => {
  const { setFieldValue } = useFormikContext<FormPublishData>()

  return (
    <div className={styles.inputMarkdown}>
      <MDEditor
        value={props.value}
        textareaProps={{
          ...props,
          className: styles.inputMarkdownContent
        }}
        preview={'edit'}
        onChange={(value: string) => {
          setFieldValue(props.name, value)
        }}
        commands={[
          bold,
          code,
          codeBlock,
          italic,
          link,
          unorderedListCommand,
          orderedListCommand,
          checkedListCommand,
          quote,
          hr,
          title,
          title1,
          title2,
          title3,
          title4,
          title5,
          title6,
          divider,
          image,
          strikethrough
        ]}
        extraCommands={[codeEdit, codePreview]}
      />
    </div>
  )
}

export default InputMarkdown
