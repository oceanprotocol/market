import { ReactElement, useEffect } from 'react'
import { useFormikContext } from 'formik'
import { wizardSteps } from './_constants'
import { useWeb3 } from '@context/Web3'
import { FormPublishData } from './_types'

export function Steps({ step }: { step: number }): ReactElement {
  const { chainId } = useWeb3()
  const { setFieldValue } = useFormikContext<FormPublishData>()

  useEffect(() => {
    if (!chainId) return

    setFieldValue('chainId', chainId)
  }, [chainId, setFieldValue])

  const { component } = wizardSteps.filter(
    (stepContent) => stepContent.step === step
  )[0]

  return component
}
