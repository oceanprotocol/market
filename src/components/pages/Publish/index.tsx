import React, { ReactElement, useState } from 'react'
import { Formik } from 'formik'
import { usePublish } from '@oceanprotocol/react'
import styles from './index.module.css'
import PublishForm from './PublishForm'
import Web3Feedback from '../../molecules/Wallet/Feedback'
import { FormContent } from '../../../@types/Form'
import { initialValues, validationSchema } from '../../../models/FormPublish'
import { transformPublishFormToMetadata } from './utils'
import Preview from './Preview'
import { MetadataPublishForm } from '../../../@types/MetaData'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { Logger, Metadata } from '@oceanprotocol/lib'
import { Persist } from '../../atoms/FormikPersist'
import Debug from './Debug'
import Feedback from './Feedback'

const formName = 'ocean-publish-form'

export default function PublishPage({
  content
}: {
  content: { form: FormContent }
}): ReactElement {
  const { debug } = useUserPreferences()
  const { publish, publishError, isLoading, publishStepText } = usePublish()

  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()
  const [did, setDid] = useState<string>()

  const hasFeedback = isLoading || error || success

  async function handleSubmit(
    values: Partial<MetadataPublishForm>,
    resetForm: () => void
  ): Promise<void> {
    const metadata = transformPublishFormToMetadata(values)
    const { price } = values
    const serviceType = values.access === 'Download' ? 'access' : 'compute'

    try {
      Logger.log('Publish with ', price, serviceType, price.datatoken)

      const ddo = await publish(
        (metadata as unknown) as Metadata,
        { ...price, swapFee: `${price.swapFee}` },
        serviceType,
        price.datatoken
      )

      // Publish failed
      if (publishError) {
        setError(publishError)
        Logger.error(publishError)
        return
      }

      // Publish succeeded
      if (ddo) {
        setDid(ddo.id)
        setSuccess('🎉 Successfully published your data set. 🎉')
        resetForm()
      }
    } catch (error) {
      setError(error.message)
      Logger.error(error.message)
    }
  }

  return (
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
          <Persist name={formName} ignoreFields={['isSubmitting']} />

          {hasFeedback ? (
            <Feedback
              error={error}
              success={success}
              publishStepText={publishStepText}
              did={did}
              setError={setError}
            />
          ) : (
            <article className={styles.grid}>
              <PublishForm content={content.form} />
              <aside>
                <div className={styles.sticky}>
                  <Preview values={values} />
                  <Web3Feedback />
                </div>
              </aside>
            </article>
          )}

          {debug === true && <Debug values={values} />}
        </>
      )}
    </Formik>
  )
}
