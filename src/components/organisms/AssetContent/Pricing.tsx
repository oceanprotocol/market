import React, { FormEvent, ReactElement, useState } from 'react'
import { Formik } from 'formik'
import { initialValues, validationSchema } from '../../../models/FormPricing'
import { DDO, Logger } from '@oceanprotocol/lib'
import { usePricing } from '@oceanprotocol/react'
import { PriceOptionsMarket } from '../../../@types/MetaData'
import Alert from '../../atoms/Alert'
import styles from './Pricing.module.css'
import FormPricing from './FormPricing'
import Loader from '../../atoms/Loader'
import SuccessConfetti from '../../atoms/SuccessConfetti'
import { toast } from 'react-toastify'

export default function Pricing({ ddo }: { ddo: DDO }): ReactElement {
  const {
    createPricing,
    pricingIsLoading,
    pricingError,
    pricingStepText
  } = usePricing(ddo)
  const [showPricing, setShowPricing] = useState(false)
  const [success, setSuccess] = useState<string>()

  const hasFeedback = pricingIsLoading || success

  async function handleCreatePricing(values: Partial<PriceOptionsMarket>) {
    try {
      const priceOptions = {
        ...values,
        // swapFee is tricky: to get 0.1% you need to send 0.001 as value
        swapFee: `${values.swapFee / 100}`
      }
      const tx = await createPricing(priceOptions)

      // Pricing failed
      if (!tx || pricingError) {
        toast.error(pricingError)
        Logger.error(pricingError)
        return
      }

      // Pricing succeeded
      tx && setSuccess(`🎉 Successfully created a ${values.type} price. 🎉`)
    } catch (error) {
      toast.error(error.message)
      Logger.error(error.message)
    }
  }

  return (
    <div className={styles.pricing}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          // move user's focus to top of screen
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

          // Kick off price creation
          await handleCreatePricing(values)
          setSubmitting(false)
        }}
      >
        {() =>
          hasFeedback ? (
            success ? (
              <SuccessConfetti success={success} />
            ) : (
              <Loader message={pricingStepText} />
            )
          ) : showPricing ? (
            <FormPricing ddo={ddo} setShowPricing={setShowPricing} />
          ) : (
            <Alert
              state="info"
              title="No Price Created"
              text="This data set has no price yet. As the publisher you can create a fixed price, or a dynamic price for it. Onwards!"
              action={{
                name: 'Create Pricing',
                handleAction: (e: FormEvent<HTMLButtonElement>) => {
                  e.preventDefault()
                  setShowPricing(true)
                }
              }}
            />
          )
        }
      </Formik>
    </div>
  )
}
