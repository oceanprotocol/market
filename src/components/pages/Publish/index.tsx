import React, { ReactElement } from 'react'
import { useNavigate } from '@reach/router'
import { toast } from 'react-toastify'
import { Formik } from 'formik'
import { usePublish, useOcean, PriceOptions } from '@oceanprotocol/react'
import styles from './index.module.css'
import PublishForm from './PublishForm'
import Web3Feedback from '../../molecules/Wallet/Feedback'
import { FormContent } from '../../../@types/Form'
import { initialValues, validationSchema } from '../../../models/FormPublish'
import { transformPublishFormToMetadata } from './utils'
import Preview from './Preview'
import { MetadataPublishForm } from '../../../@types/MetaData'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'
import { useUserPreferences } from '../../../providers/UserPreferences'

export default function PublishPage({
  content
}: {
  content: { form: FormContent }
}): ReactElement {
  const { marketFeeAddress, marketFeeAmount } = useSiteMetadata()
  const { debug } = useUserPreferences()
  const { publish, publishError, isLoading, publishStepText } = usePublish()
  const navigate = useNavigate()

  async function handleSubmit(
    values: MetadataPublishForm,
    resetForm: () => void
  ): Promise<void> {
    const metadata = transformPublishFormToMetadata(values)
    const priceOptions = values.price
    const serviceType = values.access === 'Download' ? 'access' : 'compute'

    try {
      // mpAddress and mpFee are not yet implemented in ocean js so are not used
      const ddo = await publish(
        metadata as any,
        priceOptions,
        serviceType
        // marketFeeAddress,
        // marketFeeAmount
      )

      if (publishError) {
        toast.error(publishError)
        return null
      }

      // User feedback and redirect to new asset detail page
      ddo && toast.success('Asset created successfully.')

      // reset form state
      // TODO: verify persistant form in localStorage is cleared with it too
      resetForm()

      // Go to new asset detail page
      navigate(`/asset/${ddo.id}`)
    } catch (error) {
      console.error(error.message)
      toast.error(error.message)
    }
  }

  return (
    <article className={styles.grid}>
      <Formik
        initialValues={initialValues}
        initialStatus="empty"
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          await handleSubmit(values, resetForm)
          setSubmitting(false)
        }}
      >
        {({ values }) => (
          <>
            <PublishForm
              content={content.form}
              isLoading={isLoading}
              publishStepText={publishStepText}
            />
            <aside>
              <div className={styles.sticky}>
                <Preview values={values} />
                <Web3Feedback />
              </div>
            </aside>

            {debug === true && (
              <>
                <div>
                  <h5>Collected Form Values</h5>
                  <pre>
                    <code>{JSON.stringify(values, null, 2)}</code>
                  </pre>
                </div>

                <div>
                  <h5>Transformed Values</h5>
                  <pre>
                    <code>
                      {JSON.stringify(
                        transformPublishFormToMetadata(values),
                        null,
                        2
                      )}
                    </code>
                  </pre>
                </div>
              </>
            )}
          </>
        )}
      </Formik>
    </article>
  )
}
