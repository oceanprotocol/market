import { useWeb3 } from '@context/Web3'
import { Formik } from 'formik'
import React, { ReactElement, useState } from 'react'
import { useAsset } from '@context/Asset'
import FormEditComputeDataset from './FormEditComputeDataset'
import {
  LoggerInstance,
  ServiceComputeOptions,
  Metadata
} from '@oceanprotocol/lib'
import { useUserPreferences } from '@context/UserPreferences'
import DebugEditCompute from './DebugEditCompute'
import styles from './index.module.css'
// import { transformComputeFormToServiceComputePrivacy } from '@utils/compute'
import Web3Feedback from '@shared/Web3Feedback'
import {
  getInitialValues,
  validationSchema,
  getComputeSettingsInitialValues
} from './_constants'
import content from '../../../../content/pages/editComputeDataset.json'
import { AssetExtended } from 'src/@types/AssetExtended'
import { getServiceByName } from '@utils/ddo'
import { setMinterToPublisher } from '@utils/dispenser'

export default function EditComputeDataset({
  asset
}: {
  asset: AssetExtended
}): ReactElement {
  const { debug } = useUserPreferences()
  const { accountId, web3 } = useWeb3()
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()

  const hasFeedback = error || success

  async function handleSubmit(
    values: ComputePrivacyForm,
    resetForm: () => void
  ) {
    try {
      if (asset?.accessDetails?.type === 'free') {
        const tx = await setMinterToPublisher(
          web3,
          asset?.accessDetails?.addressOrId,
          asset?.accessDetails?.datatoken?.address,
          accountId,
          setError
        )
        if (!tx) return
      }
      // const privacy = await transformComputeFormToServiceComputePrivacy(
      //   values,
      //   ocean
      // )
      // const ddoEditedComputePrivacy = await ocean.compute.editComputePrivacy(
      //   ddo,
      //   1,
      //   privacy as ServiceComputePrivacy
      // )
      // if (!ddoEditedComputePrivacy) {
      //   setError(content.form.error)
      //   LoggerInstance.error(content.form.error)
      //   return
      // }
      const newComputeSettings: ServiceComputeOptions = {
        publisherTrustedAlgorithms = values.publisherTrustedAlgorithms
      }
      const newMetadata: Metadata = {
        name: values.name,
        description: values.description,
        links: typeof values.links !== 'string' ? values.links : [],
        author: values.author,
        ...asset.metadata
      }
      // const storedddo = await ocean.assets.updateMetadata(
      //   ddoEditedComputePrivacy,
      //   accountId
      // )
      // if (!storedddo) {
      //   setError(content.form.error)
      //   LoggerInstance.error(content.form.error)
      //   return
      // } else {
      //   if (price.type === 'free') {
      //     const tx = await setMinterToDispenser(
      //       ocean,
      //       ddo.services[0].datatokenAddress,
      //       accountId,
      //       setError
      //     )
      //     if (!tx) return
      //   }
      //   // Edit succeeded
      //   setSuccess(content.form.success)
      //   resetForm()
      // }
    } catch (error) {
      LoggerInstance.error(error.message)
      setError(error.message)
    }
  }

  return (
    <Formik
      initialValues={getComputeSettingsInitialValues(
        getServiceByName(asset, 'compute')?.compute
      )}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        // move user's focus to top of screen
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        // kick off editing
        await handleSubmit(values as any, resetForm)
      }}
    >
      {({ values, isSubmitting }) =>
        isSubmitting || hasFeedback ? (
          <div />
        ) : (
          <>
            <p className={styles.description}>{content.description}</p>
            <article className={styles.grid}>
              <FormEditComputeDataset
                title={content.form.title}
                data={content.form.data}
              />
            </article>
            <Web3Feedback
              networkId={asset?.chainId}
              // isAssetNetwork={isAssetNetwork}
            />
            {debug === true && (
              <div className={styles.grid}>
                {/* <DebugEditCompute values={values} ddo={ddo} /> */}
              </div>
            )}
          </>
        )
      }
    </Formik>
  )
}
