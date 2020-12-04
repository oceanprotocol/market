import { useOcean } from '@oceanprotocol/react'
import { Formik } from 'formik'
import React, { ReactElement } from 'react'
import {
  MetadataMarket,
  MetadataPublishForm
} from '../../../../@types/MetaData'
import { validationSchema } from '../../../../models/FormEditMetadata'
import { useAsset } from '../../../../providers/Asset'
import MetadataPreview from '../../../molecules/MetadataPreview'
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
  const { ocean, account } = useOcean()
  const { did } = useAsset()

  const initialValues = {
    name: metadata.main.name,
    description: metadata.additionalInformation.description
  }

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
      <p className={styles.description}>
        Update selected metadata of this data set. Updating metadata will create
        a transaction on-chain.
      </p>
      <article className={styles.grid}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await handleSubmit(values)
            setSubmitting(false)
          }}
        >
          {({ isSubmitting, submitForm, values }) => (
            <>
              <FormEditMetadata values={values} setShowEdit={setShowEdit} />

              <aside>
                <MetadataPreview values={values} />
                <Web3Feedback />
              </aside>
            </>
          )}
        </Formik>
      </article>
    </>
  )
}
