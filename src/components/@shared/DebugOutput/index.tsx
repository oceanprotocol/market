import React, { ReactElement } from 'react'

export default function DebugOutput({
  title,
  output
}: {
  title?: string
  output: any
}): ReactElement {
  return (
    <div style={{ marginTop: 'var(--spacer)' }}>
      {title && <h5>{title}</h5>}
      <pre style={{ wordWrap: 'break-word' }}>
        <code>{JSON.stringify(output, null, 2)}</code>
      </pre>
    </div>
  )
}
