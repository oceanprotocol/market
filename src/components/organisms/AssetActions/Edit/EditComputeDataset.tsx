import { useOcean } from '@oceanprotocol/react'
import { Formik } from 'formik'
import React, { ReactElement, useEffect, useState } from 'react'
import {
  validationSchema,
  getInitialValues
} from '../../../../models/FormEditComputeDataset'
import { useAsset } from '../../../../providers/Asset'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import MetadataPreview from '../../../molecules/MetadataPreview'
import Debug from './Debug'
import Web3Feedback from '../../../molecules/Wallet/Feedback'
import FormEditComputeDataset from './FormEditComputeDataset'
import styles from './index.module.css'
import {
  Logger,
  DDO,
  ServiceComputePrivacy,
  publisherTrustedAlgorithm as PublisherTrustedAlgorithm
} from '@oceanprotocol/lib'
import MetadataFeedback from '../../../molecules/MetadataFeedback'
import { graphql, useStaticQuery } from 'gatsby'
import Loader from '../../../atoms/Loader'
import { AlgorithmOption } from '../../../../@types/ComputeDataset'
import { getAlgorithmsOptions } from '../../../../utils/aquarius'

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
  selectedAlgorithmsDIDs: PublisherTrustedAlgorithm[],
  ocean: any
) {
  const trustedAlgorithms: PublisherTrustedAlgorithm[] = []
  for (const selectedAlgorithmDID of selectedAlgorithmsDIDs) {
    const trustedAlgorithm = selectedAlgorithmDID.did
      ? selectedAlgorithmDID
      : await ocean.compute.createPublisherTrustedAlgorithmfromDID(
          selectedAlgorithmDID.toString()
        )
    trustedAlgorithms.push(trustedAlgorithm)
  }
  return trustedAlgorithms
}

export default function EditComputeDataset({
  setShowEdit
}: {
  setShowEdit: (show: boolean) => void
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childPagesJson

  const { debug } = useUserPreferences()
  const { ocean, accountId, config } = useOcean()
  const { metadata, ddo, refreshDdo } = useAsset()
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()
  const [algorithms, setAlgorithms] = useState<AlgorithmOption[]>()

  const hasFeedback = error || success

  useEffect(() => {
    getAlgorithmsOptions(config).then((algorithms) => {
      setAlgorithms(algorithms)
    })
  }, [])

  async function handleSubmit(
    values: ServiceComputePrivacy,
    resetForm: () => void
  ) {
    try {
      let trustedAlgorithms: PublisherTrustedAlgorithm[] = []
      console.log(values)

      trustedAlgorithms = await createTrustedAlgorithmList(
        values.publisherTrustedAlgorithms,
        ocean
      )
      const privacy: ServiceComputePrivacy = {
        allowRawAlgorithm: values.allowRawAlgorithm,
        allowNetworkAccess: values.allowNetworkAccess,
        publisherTrustedAlgorithms: trustedAlgorithms
      }
      console.log(privacy)

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
      {({ isSubmitting, values, initialValues }) =>
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
              {algorithms ? (
                <>
                  <FormEditComputeDataset
                    data={content.form.data}
                    setShowEdit={setShowEdit}
                    values={initialValues}
                    algorithmList={algorithms}
                  />

                  <aside>
                    {/*
                <MetadataPreview values={values} />
                */}
                    <Web3Feedback />
                  </aside>
                </>
              ) : (
                <Loader />
              )}

              {/* debug === true && <Debug values={values} ddo={ddo} /> */}
            </article>
          </>
        )
      }
    </Formik>
  )
}
