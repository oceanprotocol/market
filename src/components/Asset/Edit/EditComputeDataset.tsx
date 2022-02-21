import { useWeb3 } from '@context/Web3'
import { Formik } from 'formik'
import React, { ReactElement, useState } from 'react'
import FormEditComputeDataset from './FormEditComputeDataset'
import {
  LoggerInstance,
  ServiceComputeOptions,
  DDO,
  Service,
  ProviderInstance,
  getHash,
  Nft,
  Asset
} from '@oceanprotocol/lib'
import { useUserPreferences } from '@context/UserPreferences'
import a from './DebugEditCompute'
import styles from './index.module.css'
// import { transformComputeFormToServiceComputePrivacy } from '@utils/compute'
import Web3Feedback from '@shared/Web3Feedback'
import { useCancelToken } from '@hooks/useCancelToken'
import {
  getComputeSettingsInitialValues,
  computeSettingsValidationSchema
} from './_constants'
import content from '../../../../content/pages/editComputeDataset.json'
import { AssetExtended } from 'src/@types/AssetExtended'
import { getServiceByName } from '@utils/ddo'
import { setMinterToPublisher, setMinterToDispenser } from '@utils/dispenser'
import { transformComputeFormToServiceComputeOptions } from '@utils/compute'
import { useAbortController } from '@hooks/useAbortController'

export default function EditComputeDataset({
  asset
}: {
  asset: AssetExtended
}): ReactElement {
  const { debug } = useUserPreferences()
  const { accountId, web3 } = useWeb3()
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()
  const newAbortController = useAbortController()
  const newCancelToken = useCancelToken()
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
      const newComputeSettings: ServiceComputeOptions =
        await transformComputeFormToServiceComputeOptions(
          values,
          asset.services[0].compute,
          asset.chainId,
          newCancelToken()
        )

      LoggerInstance.log(
        '[edit compute settings]  newComputeSettings',
        newComputeSettings
      )

      const updatedService: Service = {
        ...asset.services[0],
        compute: newComputeSettings
      }

      LoggerInstance.log(
        '[edit compute settings]  updatedService',
        updatedService
      )

      const newDdo: Asset = {
        ...asset,
        services: [updatedService]
      }

      LoggerInstance.log('[edit compute settings]  newDdo', newDdo)
      const encryptedDdo = await ProviderInstance.encrypt(
        newDdo,
        newDdo.services[0].serviceEndpoint,
        newAbortController()
      )
      LoggerInstance.log(
        '[edit compute settings] Got encrypted DDO',
        encryptedDdo
      )

      const metadataHash = getHash(JSON.stringify(newDdo))
      const nft = new Nft(web3)

      const setMetadataTx = await nft.setMetadata(
        asset.nftAddress,
        accountId,
        0,
        asset.services[0].serviceEndpoint,
        '',
        '0x2',
        encryptedDdo,
        '0x' + metadataHash
      )

      LoggerInstance.log('[edit] setMetadata result', setMetadataTx)

      if (!setMetadataTx) {
        setError(content.form.error)
        LoggerInstance.error(content.form.error)
        return
      } else {
        if (asset.accessDetails.type === 'free') {
          const tx = await setMinterToDispenser(
            web3,
            asset?.accessDetails?.datatoken?.address,
            accountId,
            setError
          )
          if (!tx) return
        }
      }
      // Edit succeeded
      setSuccess(content.form.success)
      resetForm()
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
      validationSchema={computeSettingsValidationSchema}
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
            <article>
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
