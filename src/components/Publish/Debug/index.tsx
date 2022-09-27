import React, { ReactElement, useEffect, useState } from 'react'
import DebugOutput from '@shared/DebugOutput'
import { FormPublishData } from '../_types'
import { useFormikContext } from 'formik'
import { transformPublishFormToDdo } from '../_utils'
import styles from './index.module.css'
import { DDO } from '@oceanprotocol/lib'

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
    <div className={styles.debug}>
      <DebugOutput title="Collected Form Values" output={values} />
      <DebugOutput title="Transformed DDO Values" output={ddo} />
    </div>
  )
}
