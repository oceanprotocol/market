import { useOcean } from '@oceanprotocol/react'
import { Formik } from 'formik'
import React, { ReactElement, useState, useEffect } from 'react'
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
import * as EwaiUtils from '../../../../ewai/ewaiutils'
import {
  EwaiClient,
  IEwaiAssetFormFields,
  IEwaiAssetMetadata,
  useEwaiInstance
} from '../../../../ewai/client/ewai-js'
import { navigate } from 'gatsby'

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
  const ewaiInstance = useEwaiInstance()
  const content = data.content.edges[0].node.childPagesJson

  const { debug } = useUserPreferences()
  const { ocean, account } = useOcean()
  const { did, metadata, ewaiAsset, ddo, refreshDdo } = useAsset()
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()

  const hasFeedback = error || success

  // Only allow this page if the user has the proper EWAI marketplace data publisher role set
  useEffect(() => {
    if (ewaiInstance.enforceMarketplacePublishRole && account) {
      const checkRoles = async () => {
        const ewaiClient = new EwaiClient({
          username: process.env.EWAI_API_USERNAME,
          password: process.env.EWAI_API_PASSWORD,
          graphQlUrl: process.env.EWAI_API_GRAPHQL_URL
        })
        const canPubResult = await ewaiClient.ewaiCanPublishAssetsOnMarketplaceAsync(
          account.getId()
        )
        if (!canPubResult.canPublish) {
          navigate('/enrol')
        }
      }
      checkRoles()
    }
  }, [account])

  async function handleSubmit(
    values: Partial<MetadataPublishForm>,
    resetForm: () => void
  ) {
    try {
      // ---------------------------------------------
      // Validate EWAI
      // ---------------------------------------------

      // get ewai specific form fields:
      const ewaiAssetFormInfo: IEwaiAssetFormFields = EwaiUtils.transformEditFormToEwaiAssetInfo(
        values
      )

      // check to see if any schema that was entered (if any) is valid JSON Schema:
      if (ewaiAssetFormInfo.ewaiMsgSchema) {
        let msgSchemaValidatedOk = false
        if (EwaiUtils.hasJsonStructure(ewaiAssetFormInfo.ewaiMsgSchema)) {
          const check = EwaiUtils.safeJsonParse(ewaiAssetFormInfo.ewaiMsgSchema)
          msgSchemaValidatedOk =
            check.error === null || check.error === undefined
        }
        if (!msgSchemaValidatedOk) {
          const errMsg =
            'Please enter valid JSON Schema in the EWAI Message Schema field (or you must leave it blank)'
          setError(errMsg)
          Logger.error(errMsg)
          return
        }
      }

      // ---------------------------------------------
      // End Validate EWAI
      // ---------------------------------------------

      // update Ocean DDO on-chain:

      // ewai added logic: only update on-chain if ocean data changed:
      const initialValues = getInitialValues(metadata, ewaiAsset)

      if (
        initialValues.name !== values.name ||
        initialValues.description !== values.description
      ) {
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
      }

      // ---------------------------------------------
      // Update EWAI
      // ---------------------------------------------

      // create an EWAI Client instance:
      const ewaiClient = new EwaiClient({
        username: process.env.EWAI_API_USERNAME,
        password: process.env.EWAI_API_PASSWORD,
        graphQlUrl: process.env.EWAI_API_GRAPHQL_URL
      })

      const ewaiAssetMetadata: any = {
        title: values.name,
        description: values.description,
        category: ewaiAssetFormInfo.ewaiCategory,
        vendor: ewaiAssetFormInfo.ewaiVendor,
        tags: ewaiAsset.metadata.tags
      }
      const updateEwaiAsset = await ewaiClient.updateEwaiAssetAsync(
        ewaiAsset.externalDid,
        ewaiAssetFormInfo,
        ewaiAssetMetadata
      )

      // --------------------------------------------
      // End Update EWAI
      // --------------------------------------------

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
      initialValues={getInitialValues(metadata, ewaiAsset)}
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
