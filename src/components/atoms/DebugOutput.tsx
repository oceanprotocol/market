import React, { ReactElement } from 'react'

export default function DebugOutput({
  title,
  output
}: {
  title: string
  output: any
}): ReactElement {
  return (
    <div>
      <h5>{title}</h5>
      <pre>
        <code>{JSON.stringify(output, null, 2)}</code>
      </pre>
    </div>
  )
}
