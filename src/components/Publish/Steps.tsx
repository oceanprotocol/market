import { ReactElement, useEffect } from 'react'
import { useFormikContext } from 'formik'
import { wizardSteps, initialPublishFeedback } from './_constants'
import { useWeb3 } from '@context/Web3'
import { FormPublishData, PublishFeedback } from './_types'
import { getOceanConfig } from '@utils/ocean'

export function Steps({
  feedback
}: {
  feedback: PublishFeedback
}): ReactElement {
  const { chainId, accountId } = useWeb3()
  const { values, setFieldValue, touched, setTouched } =
    useFormikContext<FormPublishData>()

  // auto-sync user chainId & account into form data values
  useEffect(() => {
    if (!chainId || !accountId) return

    setFieldValue('user.chainId', chainId)
    setFieldValue('user.accountId', accountId)
  }, [chainId, accountId, setFieldValue])

  // Reset the selected baseToken on chainId change
  useEffect(() => {
    if (!chainId) return

    setFieldValue('pricing.baseToken', null)
  }, [chainId, setFieldValue])

  // auto-sync publish feedback into form data values
  useEffect(() => {
    setFieldValue('feedback', feedback)
  }, [feedback, setFieldValue])

  // auto-switch some feedback content based on pricing type
  useEffect(() => {
    setFieldValue('feedback', {
      ...feedback,
      '1': {
        ...feedback['1'],
        txCount: 1,
        description: initialPublishFeedback['1'].description
      }
    })
  }, [values.pricing.type, feedback, setFieldValue])

  // Auto-change default providerUrl on user network change
  useEffect(() => {
    if (
      !values?.user?.chainId ||
      values?.services[0]?.providerUrl.custom === true
    )
      return

    const config = getOceanConfig(values.user.chainId)
    if (config) {
      setFieldValue('services[0].providerUrl', {
        url: config.providerUri,
        valid: true,
        custom: false
      })
    }

    setTouched({ ...touched, services: [{ providerUrl: { url: true } }] })
  }, [
    values?.user?.chainId,
    values?.services[0]?.providerUrl.custom,
    setFieldValue,
    setTouched
  ])

  const { component } = wizardSteps.filter((stepContent) => {
    return stepContent.step === values.user.stepCurrent
  })[0]

  return component
}
