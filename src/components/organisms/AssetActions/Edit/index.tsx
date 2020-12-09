import { useOcean } from '@oceanprotocol/react'
import { Formik } from 'formik'
import React, { ReactElement, useState } from 'react'
import { MetadataPublishForm } from '../../../../@types/MetaData'
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
import { graphql, useStaticQuery } from 'gatsby'

const contentQuery = graphql`
  query EditMetadataQuery {
    content: allFile(filter: { relativePath: { eq: "pages/edit.json" } }) {
      edges {
        node {
          childPagesJson {
            description
            form {
              success
              successAction
              error
              data {
                name
                placeholder
                label
                help
                type
                required
                options
                rows
              }
            }
          }
        }
      }
    }
  }
`

export default function Edit({
  setShowEdit
}: {
  setShowEdit: (show: boolean) => void
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childPagesJson

  const { debug } = useUserPreferences()
  const { ocean, account } = useOcean()
  const { did, metadata, ddo, refreshDdo } = useAsset()
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
        setError(content.form.error)
        Logger.error(content.form.error)
        return
      }

      // Edit succeeded
      setSuccess(content.form.success)
      resetForm()
    } catch (error) {
      Logger.error(error.message)
      setError(error.message)
    }
  }

  return (
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
              name: content.form.successAction,
              onClick: async () => {
                await refreshDdo()
                setShowEdit(false)
              }
            }}
          />
        ) : (
          <>
            <p className={styles.description}>{content.description}</p>
            <article className={styles.grid}>
              <FormEditMetadata
                data={content.form.data}
                setShowEdit={setShowEdit}
              />

              <aside>
                <MetadataPreview values={values} />
                <Web3Feedback />
              </aside>

              {debug === true && <Debug values={values} ddo={ddo} />}
            </article>
          </>
        )
      }
    </Formik>
  )
}
