import { useOcean } from '@oceanprotocol/react'
import { Formik } from 'formik'
import React, { ReactElement, useEffect, useState } from 'react'
import { ComputePrivacy } from '../../../../@types/ComputePrivacy'
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
import axios from 'axios'
import { queryMetadata, getAssetsNames } from '../../../../utils/aquarius'
import web3 from 'web3'

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
                rows
              }
            }
          }
        }
      }
    }
  }
`

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

  interface AlgorithmOption {
    did: string
    name: string
  }

  async function getAlgorithms() {
    const query = {
      page: 1,
      query: {
        nativeSearch: 1,
        query_string: {
          query: `(service.attributes.main.type:algorithm) -isInPurgatory:true`
        }
      },
      sort: { created: -1 }
    }
    const source = axios.CancelToken.source()
    const result = await queryMetadata(
      query as any,
      config.metadataCacheUri,
      source.token
    )
    const didList: string[] = []
    await result.results.forEach((ddo: DDO) => {
      const did: string = web3.utils
        .toChecksumAddress(ddo.dataToken)
        .replace('0x', 'did:op:')
      didList.push(did)
    })
    const ddoNames = await getAssetsNames(
      didList,
      config.metadataCacheUri,
      source.token
    )
    const algorithmList: AlgorithmOption[] = []
    didList.forEach((did: string) => {
      algorithmList.push({
        did: did,
        name: ddoNames[did]
      })
    })
    setAlgorithms(algorithmList)
  }

  useEffect(() => {
    getAlgorithms()
  }, [])

  async function createTrustedAlgorithmList(
    selectedAlgorithmsDIDs: PublisherTrustedAlgorithm[]
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

  async function handleSubmit(
    values: ServiceComputePrivacy,
    resetForm: () => void
  ) {
    try {
      // Construct new DDO with new values
      let trustedAlgorithms: PublisherTrustedAlgorithm[] = []

      console.log(values)

      trustedAlgorithms = await createTrustedAlgorithmList(
        values.publisherTrustedAlgorithms
      )
      const privacy: ServiceComputePrivacy = {
        allowRawAlgorithm: values.allowRawAlgorithm,
        allowNetworkAccess: values.allowNetworkAccess,
        publisherTrustedAlgorithms: trustedAlgorithms
      }
      /* await values.trustedAlgorithms.forEach(async (algo) => {
        const newDDO = await ocean.compute.addTrustedAlgorithmtoAsset(
          ddo,
          1,
          algo
        )
      }) */

      console.log(privacy)

      const ddoEditedComputePrivacy = await ocean.compute.editComputePrivacy(
        ddo,
        1,
        privacy
      )

      // console.log(ddoEditedComputePrivacy)

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

  /* async function getAssetsNamesList() {
    const didList = [
      ddo.findServiceByType('compute').attributes.main.privacy
        .publisherTrustedAlgorithms[0].did
    ]
    const source = axios.CancelToken.source()
    const namesList: string[] = []
    const ddoNames = await getAssetsNames(
      didList,
      config.metadataCacheUri,
      source.token
    )
    didList.forEach((did: string) => {
      namesList.push(ddoNames[did])
    })
    return namesList[0]
  } */

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

              {/* debug === true && <Debug values={values} ddo={ddo} /> */}
            </article>
          </>
        )
      }
    </Formik>
  )
}
