import { Formik } from 'formik'
import React, { ReactElement, useState } from 'react'
import { validationSchema, getInitialValues } from './_constants'
import { useAsset } from '@context/Asset'
import { useUserPreferences } from '@context/UserPreferences'
import Debug from './DebugEditMetadata'
import Web3Feedback from '@shared/Web3Feedback'
import FormEditMetadata from './FormEditMetadata'
import { mapTimeoutStringToSeconds } from '@utils/metadata'
import styles from './index.module.css'
import { Logger } from '@oceanprotocol/lib'
import { graphql, useStaticQuery } from 'gatsby'
import { useWeb3 } from '@context/Web3'
import { useOcean } from '@context/Ocean'
import { setMinterToDispenser, setMinterToPublisher } from '@utils/freePrice'
import { MetadataPreview } from '../../../Publish/MetadataPreview'
import MetadataFeedback from '../../../Publish/MetadataFeedback'

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
                min
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

export default function Edit({
  setShowEdit,
  isComputeType
}: {
  setShowEdit: (show: boolean) => void
  isComputeType?: boolean
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childPagesJson

  const { debug } = useUserPreferences()
  const { accountId } = useWeb3()
  const { ocean } = useOcean()
  const { metadata, ddo, refreshDdo, price } = useAsset()
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()
  const [timeoutStringValue, setTimeoutStringValue] = useState<string>()
  const timeout = ddo.findServiceByType('access')
    ? ddo.findServiceByType('access').attributes.main.timeout
    : ddo.findServiceByType('compute').attributes.main.timeout

  const hasFeedback = error || success

  async function updateFixedPrice(newPrice: number) {
    const setPriceResp = await ocean.fixedRateExchange.setRate(
      price.address,
      newPrice,
      accountId
    )
    if (!setPriceResp) {
      setError(content.form.error)
      Logger.error(content.form.error)
    }
  }

  async function handleSubmit(
    values: Partial<MetadataEditForm>,
    resetForm: () => void
  ) {
    try {
      if (price.type === 'free') {
        const tx = await setMinterToPublisher(
          ocean,
          ddo.dataToken,
          accountId,
          setError
        )
        if (!tx) return
      }
      // Construct new DDO with new values
      const ddoEditedMetdata = await ocean.assets.editMetadata(ddo, {
        title: values.name,
        description: values.description,
        links: typeof values.links !== 'string' ? values.links : [],
        author: values.author === '' ? ' ' : values.author
      })

      price.type === 'exchange' &&
        values.price !== price.value &&
        (await updateFixedPrice(values.price))

      if (!ddoEditedMetdata) {
        setError(content.form.error)
        Logger.error(content.form.error)
        return
      }
      let ddoEditedTimeout = ddoEditedMetdata
      if (timeoutStringValue !== values.timeout) {
        const service =
          ddoEditedMetdata.findServiceByType('access') ||
          ddoEditedMetdata.findServiceByType('compute')
        const timeout = mapTimeoutStringToSeconds(values.timeout)
        ddoEditedTimeout = await ocean.assets.editServiceTimeout(
          ddoEditedMetdata,
          service.index,
          timeout
        )
      }

      if (!ddoEditedTimeout) {
        setError(content.form.error)
        Logger.error(content.form.error)
        return
      }

      const storedddo = await ocean.assets.updateMetadata(
        ddoEditedTimeout,
        accountId
      )
      if (!storedddo) {
        setError(content.form.error)
        Logger.error(content.form.error)
        return
      } else {
        if (price.type === 'free') {
          const tx = await setMinterToDispenser(
            ocean,
            ddo.dataToken,
            accountId,
            setError
          )
          if (!tx) return
        }
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
      initialValues={getInitialValues(metadata, timeout, price.value)}
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
              <FormEditMetadata
                data={content.form.data}
                setShowEdit={setShowEdit}
                setTimeoutStringValue={setTimeoutStringValue}
                values={initialValues}
                showPrice={price.type === 'exchange'}
                isComputeDataset={isComputeType}
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
