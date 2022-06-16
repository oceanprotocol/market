import React, { ReactElement } from 'react'

export interface DebugOutputProps {
  title?: string
  output: any
}

export default function DebugOutput({
  title,
  output
}: DebugOutputProps): ReactElement {
  return (
    <div style={{ marginTop: 'var(--spacer)' }}>
      {title && <h5>{title}</h5>}
      <pre style={{ wordWrap: 'break-word' }}>
        <code>{JSON.stringify(output, null, 2)}</code>
      </pre>
    </div>
  )
}
