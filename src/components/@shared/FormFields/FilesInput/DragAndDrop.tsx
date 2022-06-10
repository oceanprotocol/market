// Copyright Ocean Protocol contributors
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function DragAndDrop(props) {
  const style = {
    textAlign: 'center',
    color: 'blue',
    backgroundColor: 'white',
    padding: '1.0em',
    border: '1px dashed silver'
  }

  const onDrop = useCallback(
    (acceptedFiles) => {
      props.onFileDrop(acceptedFiles)
    },
    [props]
  )

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    noClick: true,
    maxFiles: 1,
    onDrop
  })
  const files = acceptedFiles.map((file) => <p key={file.path}>{file.path}</p>)

  return (
    <div>
      <section className="container">
        <div style={style} {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          {files && files.length > 0 ? files : <p>Drop file here</p>}
        </div>
      </section>
    </div>
  )
}
