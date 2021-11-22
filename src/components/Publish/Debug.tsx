import React, { ReactElement, useEffect, useState } from 'react'
import DebugOutput from '@shared/DebugOutput'
import { FormPublishData } from './_types'
import { useFormikContext } from 'formik'
import { transformPublishFormToDdo } from './_utils'

export default function Debug(): ReactElement {
  const { values } = useFormikContext<FormPublishData>()
  const [ddo, setDdo] = useState<DDO>()

  useEffect(() => {
    async function makeDdo() {
      const ddo = await transformPublishFormToDdo(values)
      setDdo(ddo)
    }
    makeDdo()
  }, [values])

  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--spacer)',
        gridTemplateColumns: '1fr 1fr',
        wordBreak: 'break-all'
      }}
    >
      <DebugOutput title="Collected Form Values" output={values} />
      <DebugOutput title="Transformed DDO Values" output={ddo} />
    </div>
  )
}
