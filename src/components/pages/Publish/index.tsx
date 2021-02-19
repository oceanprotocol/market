import React, { ReactElement, useState, useEffect } from 'react'
import { Formik } from 'formik'
import { usePublish, useOcean } from '@oceanprotocol/react'
import styles from './index.module.css'
import FormPublish from './FormPublish'
import FormAlgoPublish from './FormAlgoPublish'
import { PublishType, TypeOfPublish } from './PublishType'
import Web3Feedback from '../../molecules/Wallet/Feedback'
import { FormContent } from '../../../@types/Form'
import { initialValues, validationSchema } from '../../../models/FormPublish'
import {
  initialValues as initialValuesAlgorithm,
  validationSchema as validationSchemaAlgorithm
} from '../../../models/FormAlgoPublish'

import {
  transformPublishFormToMetadata,
  transformPublishAlgorithmFormToMetadata,
  mapTimeoutStringToSeconds
} from '../../../utils/metadata'
import {
  MetadataPreview,
  MetadataAlgorithmPreview
} from '../../molecules/MetadataPreview'
import {
  MetadataPublishForm,
  AlgorithmPublishForm
} from '../../../@types/MetaData'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { Logger, Metadata } from '@oceanprotocol/lib'
import { Persist } from '../../atoms/FormikPersist'
import Debug from './Debug'
import Alert from '../../atoms/Alert'
import MetadataFeedback from '../../molecules/MetadataFeedback'
import Button from '../../atoms/Button'

const formName = 'ocean-publish-form'

export default function PublishPage({
  content
}: {
  content: { warning: string }
}): ReactElement {
  const { debug } = useUserPreferences()
  const { publish, publishError, isLoading, publishStepText } = usePublish()
  const { isInPurgatory, purgatoryData } = useOcean()
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()
  const [title, setTitle] = useState<string>()
  const [did, setDid] = useState<string>()
  const [publishType, setPublishType] = useState<string>()

  const hasFeedback = isLoading || error || success

  useEffect(() => {
    publishType === TypeOfPublish.dataset
      ? setTitle('Publishing Data Set')
      : setTitle('Publishing Algorithm')
  }, [publishType])

  async function handleSubmit(
    values: Partial<MetadataPublishForm>,
    resetForm: () => void
  ): Promise<void> {
    const metadata = transformPublishFormToMetadata(values)
    const timeout = mapTimeoutStringToSeconds(values.timeout)

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
        values.dataTokenOptions,
        timeout
      )

      // Publish failed
      if (!ddo || publishError) {
        setError(publishError || 'Publishing DDO failed.')
        Logger.error(publishError || 'Publishing DDO failed.')
        return
      }

      // Publish succeeded
      setDid(ddo.id)
      setSuccess(
        '🎉 Successfully published. 🎉 Now create a price on your data set.'
      )
      resetForm()
    } catch (error) {
      setError(error.message)
      Logger.error(error.message)
    }
  }

  async function handleAlgorithmSubmit(
    values: Partial<AlgorithmPublishForm>,
    resetForm: () => void
  ): Promise<void> {
    const metadata = transformPublishAlgorithmFormToMetadata(values)

    try {
      Logger.log('Publish Algorithm with ', metadata)

      const ddo = await publish(
        (metadata as unknown) as Metadata,
        values.algorithmPrivacy === true ? 'compute' : 'access'
      )

      // Publish failed
      if (!ddo || publishError) {
        setError(publishError || 'Publishing DDO failed.')
        Logger.error(publishError || 'Publishing DDO failed.')
        return
      }

      // Publish succeeded
      setDid(ddo.id)
      setSuccess(
        '🎉 Successfully published. 🎉 Now create a price for your algorithm.'
      )
      resetForm()
    } catch (error) {
      setError(error.message)
      Logger.error(error.message)
    }
  }

  return isInPurgatory && purgatoryData ? null : (
    <Formik
      initialValues={
        publishType === TypeOfPublish.dataset
          ? initialValues
          : initialValuesAlgorithm
      }
      initialStatus="empty"
      validationSchema={
        publishType === TypeOfPublish.dataset
          ? validationSchema
          : validationSchemaAlgorithm
      }
      onSubmit={async (values, { resetForm }) => {
        // move user's focus to top of screen
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        // kick off publishing
        publishType === TypeOfPublish.dataset
          ? await handleSubmit(values, resetForm)
          : await handleAlgorithmSubmit(values, resetForm)
      }}
    >
      {({ values }) => (
        <>
          <Persist name={formName} ignoreFields={['isSubmitting']} />

          {hasFeedback ? (
            <MetadataFeedback
              title={title}
              error={error}
              success={success}
              loading={publishStepText}
              setError={setError}
              successAction={{
                name: 'Go to data set →',
                to: `/asset/${did}`
              }}
            />
          ) : (
            <>
              <PublishType type={publishType} setType={setPublishType} />
              <Alert
                text={content.warning}
                state="info"
                className={styles.alert}
              />
              <article className={styles.grid}>
                {publishType === TypeOfPublish.dataset ? (
                  <FormPublish />
                ) : (
                  <FormAlgoPublish />
                )}

                <aside>
                  <div className={styles.sticky}>
                    {publishType === TypeOfPublish.dataset ? (
                      <MetadataPreview values={values} />
                    ) : (
                      <MetadataAlgorithmPreview values={values} />
                    )}
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
