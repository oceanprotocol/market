import { useOcean } from '@oceanprotocol/react'
import { Formik } from 'formik'
import React, { ReactElement, useState } from 'react'
import {
  MetadataMarket,
  MetadataPublishForm
} from '../../../../@types/MetaData'
import {
  validationSchema,
  getInitialValues
} from '../../../../models/FormEditMetadata'
import { useAsset } from '../../../../providers/Asset'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import MetadataPreview from '../../../molecules/MetadataPreview'
import Debug from './Debug'
import Web3Feedback from '../../../molecules/Wallet/Feedback'
import FormEditMetadata from './FormEditMetadata'
import styles from './index.module.css'
import { Logger } from '@oceanprotocol/lib'
import MetadataFeedback from '../../../molecules/MetadataFeedback'

export default function Edit({
  metadata,
  setShowEdit
}: {
  metadata: MetadataMarket
  setShowEdit: (show: boolean) => void
}): ReactElement {
  const { debug } = useUserPreferences()
  const { ocean, account } = useOcean()
  const { did } = useAsset()
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()

  const hasFeedback = error || success

  async function handleSubmit(
    values: Partial<MetadataPublishForm>,
    resetForm: () => void
  ) {
    try {
      const ddo = await ocean.assets.editMetadata(
        did,
        { title: values.name, description: values.description },
        account
      )

      // Edit failed
      if (!ddo) {
        setError('Updating DDO failed.')
        Logger.error('Updating DDO failed.')
        return
      }

      // Edit succeeded
      setSuccess('🎉 Successfully updated. 🎉 Reload to see your changes.')
      resetForm()
    } catch (error) {
      Logger.error(error.message)
      setError(error.message)
    }
  }

  return (
    <>
      {/* TODO: move content out of here into content folder, and source from there */}
      <p className={styles.description}>
        Update selected metadata of this data set. Updating metadata will create
        an on-chain transaction you have to approve in your wallet.
      </p>

      <Formik
        initialValues={getInitialValues(metadata)}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          // move user's focus to top of screen
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
          // kick off editing
          await handleSubmit(values, resetForm)
        }}
      >
        {({ isSubmitting, values }) =>
          isSubmitting || hasFeedback ? (
            <MetadataFeedback
              title="Updating Data Set"
              error={error}
              success={success}
              setError={setError}
              successAction={{
                name: 'Refresh Page',
                onClick: () => window.location.reload()
              }}
            />
          ) : (
            <article className={styles.grid}>
              <FormEditMetadata values={values} setShowEdit={setShowEdit} />

              <aside>
                <MetadataPreview values={values} />
                <Web3Feedback />
              </aside>

              {debug === true && <Debug values={values} />}
            </article>
          )
        }
      </Formik>
    </>
  )
}
