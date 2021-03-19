import { useOcean } from '../../../../providers/Ocean'
import { useWeb3 } from '../../../../providers/Web3'
import { Formik } from 'formik'
import React, { ReactElement, useState } from 'react'
import {
  validationSchema,
  getInitialValues
} from '../../../../models/FormEditComputeDataset'
import { useAsset } from '../../../../providers/Asset'
import FormEditComputeDataset from './FormEditComputeDataset'
import styles from './index.module.css'
import {
  Logger,
  ServiceComputePrivacy,
  publisherTrustedAlgorithm as PublisherTrustedAlgorithm,
  Ocean
} from '@oceanprotocol/lib'
import MetadataFeedback from '../../../molecules/MetadataFeedback'
import { graphql, useStaticQuery } from 'gatsby'
import { AssetSelectionAsset } from '../../../molecules/FormFields/AssetSelection'

const contentQuery = graphql`
  query EditComputeDataQuery {
    content: allFile(
      filter: { relativePath: { eq: "pages/editComputeDataset.json" } }
    ) {
      edges {
        node {
          childPagesJson {
            description
            form {
              title
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
                sortOptions
                options
                multiple
                rows
              }
            }
          }
        }
      }
    }
  }
`

async function createTrustedAlgorithmList(
  selectedAlgorithms: PublisherTrustedAlgorithm[],
  ocean: Ocean
) {
  const trustedAlgorithms: PublisherTrustedAlgorithm[] = []
  for (const selectedAlgorithm of selectedAlgorithms) {
    const trustedAlgorithm = selectedAlgorithm.filesChecksum
      ? selectedAlgorithm
      : await ocean.compute.createPublisherTrustedAlgorithmfromDID(
          selectedAlgorithm.did.toString()
        )
    trustedAlgorithms.push(trustedAlgorithm)
  }
  return trustedAlgorithms
}

export default function EditComputeDataset({
  setShowEdit,
  algorithmOptions,
  setAlgorithmsOptions
}: {
  setShowEdit: (show: boolean) => void
  algorithmOptions: AssetSelectionAsset[]
  setAlgorithmsOptions: (algorithmOptions: AssetSelectionAsset[]) => void
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childPagesJson
  content.form.data.find(
    (data: { name: string }) => data.name === 'publisherTrustedAlgorithms'
  ).options = algorithmOptions

  const { ocean } = useOcean()
  const { accountId } = useWeb3()
  const { ddo, refreshDdo } = useAsset()
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()

  const hasFeedback = error || success

  async function handleSubmit(
    values: ServiceComputePrivacy,
    resetForm: () => void
  ) {
    try {
      let trustedAlgorithms: PublisherTrustedAlgorithm[] = []

      trustedAlgorithms = await createTrustedAlgorithmList(
        values.publisherTrustedAlgorithms,
        ocean
      )

      const privacy: ServiceComputePrivacy = {
        allowRawAlgorithm: false,
        allowNetworkAccess: values.allowNetworkAccess,
        publisherTrustedAlgorithms: trustedAlgorithms
      }

      const ddoEditedComputePrivacy = await ocean.compute.editComputePrivacy(
        ddo,
        1,
        privacy
      )

      if (!ddoEditedComputePrivacy) {
        setError(content.form.error)
        Logger.error(content.form.error)
        return
      }

      const storedddo = await ocean.assets.updateMetadata(
        ddoEditedComputePrivacy,
        accountId
      )
      if (!storedddo) {
        setError(content.form.error)
        Logger.error(content.form.error)
        return
      } else {
        // Edit succeeded
        setSuccess(content.form.success)
        resetForm()
      }
    } catch (error) {
      Logger.error(error.message)
      setError(error.message)
    }
  }

  return (
    <Formik
      initialValues={getInitialValues(
        ddo.findServiceByType('compute').attributes.main.privacy
      )}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        // move user's focus to top of screen
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        // kick off editing
        await handleSubmit(values, resetForm)
      }}
    >
      {({ isSubmitting }) =>
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
              <>
                <FormEditComputeDataset
                  title={content.form.title}
                  data={content.form.data}
                  setShowEdit={setShowEdit}
                  algorithmList={algorithmOptions}
                  setAlgorithmsOptions={setAlgorithmsOptions}
                />
              </>
            </article>
          </>
        )
      }
    </Formik>
  )
}
