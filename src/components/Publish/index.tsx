import React, { ReactElement, useState, useEffect } from 'react'
import Permission from '@shared/Permission'
import { Formik, FormikState } from 'formik'
import { usePublish } from '@hooks/usePublish'
import styles from './index.module.css'
import { initialValues, validationSchema } from './_constants'
import {
  transformPublishFormToMetadata,
  mapTimeoutStringToSeconds,
  validateDockerImage
} from '@utils/metadata'
import { Logger, Metadata } from '@oceanprotocol/lib'
import { useAccountPurgatory } from '@hooks/useAccountPurgatory'
import { useWeb3 } from '@context/Web3'
import { FormPublishData } from './_types'

const formName = 'ocean-publish-form'

export default function PublishPage({
  content
}: {
  content: { warning: string }
}): ReactElement {
  const { accountId } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)
  const { publish, publishError, isLoading, publishStepText } = usePublish()
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()

  async function handleSubmit(
    values: Partial<FormPublishData>,
    resetForm: (
      nextState?: Partial<FormikState<Partial<FormPublishData>>>
    ) => void
  ): Promise<void> {
    try {
      const metadata = transformPublishFormToMetadata(values)
      const timeout = mapTimeoutStringToSeconds(values.timeout)

      const serviceType = values.access === 'Download' ? 'access' : 'compute'
      Logger.log(
        'Publish with ',
        metadata,
        serviceType,
        values.dataTokenOptions,
        values.providerUri
      )

      const ddo = await publish(
        metadata as unknown as Metadata,
        serviceType,
        values.dataTokenOptions,
        timeout,
        values.providerUri
      )

      // Publish failed
      if (!ddo || publishError) {
        setError(publishError || 'Publishing DDO failed.')
        Logger.error(publishError || 'Publishing DDO failed.')
        return
      }

      // Publish succeeded
      // setDid(ddo.id)
      setSuccess(
        '🎉 Successfully published. 🎉 Now create a price on your data set.'
      )
      resetForm({
        values: initialValues as FormPublishData,
        status: 'empty'
      })
      // move user's focus to top of screen
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    } catch (error) {
      setError(error.message)
      Logger.error(error.message)
    }
  }

  return isInPurgatory && purgatoryData ? null : (
    <Permission eventType="publish">
      <Formik
        initialValues={initialValues}
        initialStatus="empty"
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          // kick off publishing
          await handleSubmit(values, resetForm)
        }}
      >
        {({ values }) => {
          return <>Hello</>
        }}
      </Formik>
    </Permission>
  )
}
