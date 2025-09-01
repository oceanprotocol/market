import { ReactElement, useEffect } from 'react'
import { useFormikContext } from 'formik'
import { wizardSteps, initialPublishFeedback } from './_constants'
import { FormPublishData, PublishFeedback } from './_types'
import { getOceanConfig } from '@utils/ocean'
import { useAppKitAccount, useAppKitNetworkCore } from '@reown/appkit/react'
import { useMarketMetadata } from '@context/MarketMetadata'

export function Steps({
  feedback
}: {
  feedback: PublishFeedback
}): ReactElement {
  const { address: accountId } = useAppKitAccount()
  const { chainId } = useAppKitNetworkCore()
  const { approvedBaseTokens } = useMarketMetadata()
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
        token.name
          .toLowerCase()
          .includes(process.env.NEXT_PUBLIC_OCEAN_TOKEN_SYMBOL.toLowerCase())
      ) || approvedBaseTokens?.[0]
    const isBaseTokenSet = !!approvedBaseTokens?.find(
      (token) => token?.address === values?.pricing?.baseToken?.address
    )
    if (isBaseTokenSet) return

    setFieldValue('pricing.baseToken', defaultBaseToken)
  }, [approvedBaseTokens, values?.pricing?.baseToken?.address])

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
        url: config.oceanNodeUri,
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
