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
  const { chainId, accountId, approvedBaseTokens } = useWeb3()
  const { values, setFieldValue, touched, setTouched } =
    useFormikContext<FormPublishData>()

  const isCustomProviderUrl = values?.services?.[0]?.providerUrl.custom

  // auto-sync user chainId & account into form data values
  useEffect(() => {
    if (!chainId || !accountId) return

    setFieldValue('user.chainId', chainId)
    setFieldValue('user.accountId', accountId)
  }, [chainId, accountId, setFieldValue])

  useEffect(() => {
    if (!approvedBaseTokens?.length) return

    const defaultBaseToken =
      approvedBaseTokens?.find((token) =>
        token.name.toLowerCase().includes('ocean')
      ) || approvedBaseTokens?.[0]
    const isBaseTokenSet = !!approvedBaseTokens?.find(
      (token) => token?.address === values?.pricing?.baseToken?.address
    )
    if (isBaseTokenSet) return

    setFieldValue('pricing.baseToken', defaultBaseToken)
  }, [approvedBaseTokens])

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
    if (!values?.user?.chainId || isCustomProviderUrl === true) return

    const config = getOceanConfig(values.user.chainId)
    if (config) {
      setFieldValue('services[0].providerUrl', {
        url: config.providerUri,
        valid: true,
        custom: false
      })
    }

    setTouched({ ...touched, services: [{ providerUrl: { url: true } }] })
  }, [values?.user?.chainId, isCustomProviderUrl, setFieldValue, setTouched])

  const { component } = wizardSteps.filter((stepContent) => {
    return stepContent.step === values.user.stepCurrent
  })[0]

  return component
}
