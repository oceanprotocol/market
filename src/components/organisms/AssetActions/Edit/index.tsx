import { useOcean } from '@oceanprotocol/react'
import { Formik } from 'formik'
import React, { ReactElement } from 'react'
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

  async function handleSubmit(values: Partial<MetadataPublishForm>) {
    try {
      const ddo = await ocean.assets.editMetadata(
        did,
        { title: values.name, description: values.description },
        account
      )
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <>
      {/* TODO: move content out of here into content folder, and source from there */}
      <p className={styles.description}>
        Update selected metadata of this data set. Updating metadata will create
        an on-chain transaction you have to approve in your wallet.
      </p>
      <article className={styles.grid}>
        <Formik
          initialValues={getInitialValues(metadata)}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await handleSubmit(values)
            setSubmitting(false)
          }}
        >
          {({ isSubmitting, submitForm, values }) => (
            // TODO: somehow handle submitting state. Either only in the actions within FormEditMetadata, or replacing the whole view
            <>
              <FormEditMetadata values={values} setShowEdit={setShowEdit} />

              <aside>
                <MetadataPreview values={values} />
                <Web3Feedback />
              </aside>

              {debug === true && <Debug values={values} />}
            </>
          )}
        </Formik>
      </article>
    </>
  )
}
