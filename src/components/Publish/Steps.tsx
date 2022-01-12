import { ReactElement, useEffect } from 'react'
import { useFormikContext } from 'formik'
import { wizardSteps } from './_constants'
import { useWeb3 } from '@context/Web3'
import { FormPublishData, PublishFeedback } from './_types'

export function Steps({
  feedback
}: {
  feedback: PublishFeedback
}): ReactElement {
  const { chainId, accountId } = useWeb3()
  const { values, setFieldValue } = useFormikContext<FormPublishData>()

  // auto-sync user chainId & account into form data values
  useEffect(() => {
    if (!chainId || !accountId) return

    setFieldValue('user.chainId', chainId)
    setFieldValue('user.accountId', accountId)
  }, [chainId, accountId, setFieldValue])

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
        txCount: values.pricing.type === 'dynamic' ? 2 : 1,
        description:
          values.pricing.type === 'dynamic'
            ? feedback['1'].description.replace(
                'a single transaction',
                'a single transaction, after an initial approve transaction'
              )
            : feedback['1'].description
      }
    })
  }, [values.pricing.type, setFieldValue])

  const { component } = wizardSteps.filter(
    (stepContent) => stepContent.step === values.user.stepCurrent
  )[0]

  return component
}
