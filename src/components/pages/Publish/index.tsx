import React, { ReactElement, useState, useEffect } from 'react'
import { Formik } from 'formik'
import { usePublish, useOcean } from '@oceanprotocol/react'
import styles from './index.module.css'
import FormPublish from './FormPublish'
import FormAlgoPublish from './FormAlgoPublish'
import Web3Feedback from '../../molecules/Wallet/Feedback'
import Tabs from '../../atoms/Tabs'
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
  MetadataPublishFormDataset,
  MetadataPublishFormAlgorithm
} from '../../../@types/MetaData'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { Logger, Metadata, MetadataMain } from '@oceanprotocol/lib'
import { Persist } from '../../atoms/FormikPersist'
import Debug from './Debug'
import Alert from '../../atoms/Alert'
import MetadataFeedback from '../../molecules/MetadataFeedback'

const formName = 'ocean-publish-form'

function TabContent({
  publishType,
  values
}: {
  publishType: MetadataMain['type']
  values:
    | Partial<MetadataPublishFormDataset>
    | Partial<MetadataPublishFormAlgorithm>
}) {
  return (
    <article className={styles.grid}>
      {publishType === 'dataset' ? <FormPublish /> : <FormAlgoPublish />}

      <aside>
        <div className={styles.sticky}>
          {publishType === 'dataset' ? (
            <MetadataPreview values={values} />
          ) : (
            <MetadataAlgorithmPreview values={values} />
          )}

          <Web3Feedback />
        </div>
      </aside>
    </article>
  )
}

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
  const [publishType, setPublishType] = useState<MetadataMain['type']>()

  const hasFeedback = isLoading || error || success

  useEffect(() => {
    publishType === 'dataset'
      ? setTitle('Publishing Data Set')
      : setTitle('Publishing Algorithm')
  }, [publishType])

  async function handleSubmit(
    values: Partial<MetadataPublishFormDataset>,
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
    values: Partial<MetadataPublishFormAlgorithm>,
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
        publishType === 'dataset' ? initialValues : initialValuesAlgorithm
      }
      initialStatus="empty"
      validationSchema={
        publishType === 'dataset' ? validationSchema : validationSchemaAlgorithm
      }
      onSubmit={async (values, { resetForm }) => {
        // move user's focus to top of screen
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        // kick off publishing
        publishType === 'dataset'
          ? await handleSubmit(values, resetForm)
          : await handleAlgorithmSubmit(values, resetForm)
      }}
    >
      {({ values }) => {
        const tabs = [
          {
            title: 'Data Set',
            content: <TabContent values={values} publishType={publishType} />
          },
          {
            title: 'Algorithm',
            content: <TabContent values={values} publishType={publishType} />
          }
        ]

        return (
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
                <Alert
                  text={content.warning}
                  state="info"
                  className={styles.alert}
                />

                <div className={styles.tabs}>
                  <Tabs
                    items={tabs}
                    handleTabChange={(title) =>
                      setPublishType(
                        title.toLowerCase().replace(' ', '') as any
                      )
                    }
                  />
                </div>
              </>
            )}

            {debug === true && <Debug values={values} />}
          </>
        )
      }}
    </Formik>
  )
}
