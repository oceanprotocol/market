import React, { ReactElement, useState } from 'react'
import { Formik } from 'formik'
import { usePublish, useOcean } from '@oceanprotocol/react'
import styles from './index.module.css'
import FormPublish from './FormPublish'
import Web3Feedback from '../../molecules/Wallet/Feedback'
import { FormContent } from '../../../@types/Form'
import { initialValues, validationSchema } from '../../../models/FormPublish'
import { transformPublishFormToMetadata } from '../../../utils/metadata'
import MetadataPreview from '../../molecules/MetadataPreview'
import { MetadataPublishForm } from '../../../@types/MetaData'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { DDO, Logger, Metadata } from '@oceanprotocol/lib'
import { Persist } from '../../atoms/FormikPersist'
import Debug from './Debug'
import Alert from '../../atoms/Alert'
import MetadataFeedback from '../../molecules/MetadataFeedback'

const formName = 'ocean-publish-form'

export default function PublishPage({
  content
}: {
  content: { warning: string; form: FormContent }
}): ReactElement {
  const { debug } = useUserPreferences()
  const { publish, publishError, isLoading, publishStepText } = usePublish()
  const { isInPurgatory, purgatoryData } = useOcean()
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()
  const [ddo, setDdo] = useState<DDO>()

  const hasFeedback = isLoading || error || success

  async function handleSubmit(
    values: Partial<MetadataPublishForm>,
    resetForm: () => void
  ): Promise<void> {
    const metadata = transformPublishFormToMetadata(values)
    const serviceType = values.access === 'Download' ? 'access' : 'compute'

    try {
      Logger.log(
        'Publish with ',
        metadata,
        serviceType,
        values.dataTokenOptions
      )

      const ddo = await publish(
        (metadata as unknown) as Metadata,
        serviceType,
        values.dataTokenOptions
      )

      // Publish failed
      if (!ddo || publishError) {
        setError(publishError || 'Publishing DDO failed.')
        Logger.error(publishError || 'Publishing DDO failed.')
        return
      }

      // Publish succeeded
      setDdo(ddo)
      setSuccess(
        '🎉 Successfully published. 🎉 Now create a price on your data set.'
      )
      resetForm()
    } catch (error) {
      setError(error.message)
      Logger.error(error.message)
    }
  }

  return isInPurgatory && purgatoryData ? null : (
    <Formik
      initialValues={initialValues}
      initialStatus="empty"
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        // move user's focus to top of screen
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        // kick off publishing
        await handleSubmit(values, resetForm)
      }}
    >
      {({ values }) => (
        <>
          <Persist name={formName} ignoreFields={['isSubmitting']} />

          {hasFeedback ? (
            <MetadataFeedback
              title="Publishing Data Set"
              error={error}
              success={success}
              loading={publishStepText}
              setError={setError}
              successAction={{
                name: 'Go to data set →',
                to: `/asset/${ddo?.id}`
              }}
            />
          ) : (
            <>
              <Alert
                text={content.warning}
                state="info"
                className={styles.alert}
              />
              <article className={styles.grid}>
                <FormPublish content={content.form} />

                <aside>
                  <div className={styles.sticky}>
                    <MetadataPreview values={values} />
                    <Web3Feedback />
                  </div>
                </aside>
              </article>
            </>
          )}

          {debug === true && <Debug values={values} />}
        </>
      )}
    </Formik>
  )
}
