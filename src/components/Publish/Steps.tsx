import { ReactElement, useEffect } from 'react'
import { useFormikContext } from 'formik'
import { wizardSteps } from './_constants'
import { useWeb3 } from '@context/Web3'
import { FormPublishData } from './_types'

export function Steps(): ReactElement {
  const { chainId, accountId } = useWeb3()
  const { values, setFieldValue } = useFormikContext<FormPublishData>()

  useEffect(() => {
    if (!chainId || !accountId) return

    setFieldValue('user.chainId', chainId)
    setFieldValue('user.accountId', accountId)
  }, [chainId, accountId, setFieldValue])

  const { component } = wizardSteps.filter(
    (stepContent) => stepContent.step === values.user.stepCurrent
  )[0]

  return component
}
