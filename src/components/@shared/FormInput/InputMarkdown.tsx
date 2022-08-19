import React, { ReactElement, useEffect, useState, ChangeEvent } from 'react'
import { useFormikContext } from 'formik'
import { FormPublishData } from '../../Publish/_types'
import dynamic from 'next/dynamic'
import styles from './InputMarkdown.module.css'

import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const InputMarkdown = ({ ...props }): ReactElement => {
  const [value, setValue] = useState('')
  const { values, setFieldValue } = useFormikContext<FormPublishData>()

  useEffect(() => {
    setFieldValue(props.name, value)
  }, [props.name, setFieldValue, value])

  return (
    <div className={styles.inputMarkdown}>
      <MDEditor
        value={values.metadata.description}
        textareaProps={{
          ...props,
          className: styles.inputMarkdownContent
        }}
        onChange={setValue}
      />
    </div>
  )
}

export default InputMarkdown
