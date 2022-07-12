import React, { ReactElement, useState } from 'react'
import { Formik } from 'formik'
import {
  LoggerInstance,
  Metadata,
  FixedRateExchange,
  Asset,
  Service
} from '@oceanprotocol/lib'
import { validationSchema, getInitialValues } from './_constants'
import { MetadataEditForm } from './_types'
import { useWeb3 } from '@context/Web3'
import { useUserPreferences } from '@context/UserPreferences'
import Web3Feedback from '@shared/Web3Feedback'
import FormEditMetadata from './FormEditMetadata'
import { mapTimeoutStringToSeconds } from '@utils/ddo'
import styles from './index.module.css'
import content from '../../../../content/pages/editMetadata.json'
import { AssetExtended } from 'src/@types/AssetExtended'
import { useAbortController } from '@hooks/useAbortController'
import DebugEditMetadata from './DebugEditMetadata'
import { getOceanConfig } from '@utils/ocean'
import EditFeedback from './EditFeedback'
import { useAsset } from '@context/Asset'
import { setNftMetadata } from '@utils/nft'
import { sanitizeUrl } from '@utils/url'
import { getEncryptedFiles } from '@utils/provider'

export default function Edit({
  asset
}: {
  asset: AssetExtended
}): ReactElement {
  const { debug } = useUserPreferences()
  const { fetchAsset, isAssetNetwork } = useAsset()
  const { accountId, web3 } = useWeb3()
  const newAbortController = useAbortController()
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()
  const isComputeType = asset?.services[0]?.type === 'compute'
  const hasFeedback = error || success

  async function updateFixedPrice(newPrice: string) {
    const config = getOceanConfig(asset.chainId)

    const fixedRateInstance = new FixedRateExchange(
      web3,
      config.fixedRateExchangeAddress
    )

    const setPriceResp = await fixedRateInstance.setRate(
      accountId,
      asset.accessDetails.addressOrId,
      newPrice.toString()
    )
    LoggerInstance.log('[edit] setFixedRate result', setPriceResp)
    if (!setPriceResp) {
      setError(content.form.error)
      LoggerInstance.error(content.form.error)
    }
  }

  async function handleSubmit(
    values: Partial<MetadataEditForm>,
    resetForm: () => void
  ) {
    try {
      let updatedFiles = asset.services[0].files
      const linksTransformed = values.links?.length &&
        values.links[0].valid && [sanitizeUrl(values.links[0].url)]
      const updatedMetadata: Metadata = {
        ...asset.metadata,
        name: values.name,
        description: values.description,
        links: linksTransformed,
        author: values.author
      }

      asset?.accessDetails?.type === 'fixed' &&
        values.price !== asset.accessDetails.price &&
        (await updateFixedPrice(values.price))

      if (values.files[0]?.url) {
        const file = {
          nftAddress: asset.nftAddress,
          datatokenAddress: asset.services[0].datatokenAddress,
          files: [
            {
              type: 'url',
              index: 0,
              url: values.files[0].url,
              method: 'GET'
            }
          ]
        }
        const filesEncrypted = await getEncryptedFiles(
          file,
          asset.services[0].serviceEndpoint
        )
        updatedFiles = filesEncrypted
      }
      const updatedService: Service = {
        ...asset.services[0],
        timeout: mapTimeoutStringToSeconds(values.timeout),
        files: updatedFiles
      }

      // TODO: remove version update at a later time
      const updatedAsset: Asset = {
        ...(asset as Asset),
        version: '4.1.0',
        metadata: updatedMetadata,
        services: [updatedService]
      }

      // delete custom helper properties injected in the market so we don't write them on chain
      delete (updatedAsset as AssetExtended).accessDetails
      delete (updatedAsset as AssetExtended).datatokens
      delete (updatedAsset as AssetExtended).stats
      const setMetadataTx = await setNftMetadata(
        updatedAsset,
        accountId,
        web3,
        newAbortController()
      )

      LoggerInstance.log('[edit] setMetadata result', setMetadataTx)

      if (!setMetadataTx) {
        setError(content.form.error)
        LoggerInstance.error(content.form.error)
        return
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
      enableReinitialize
      initialValues={getInitialValues(
        asset?.metadata,
        asset?.services[0]?.timeout,
        asset?.accessDetails?.price
      )}
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
          <EditFeedback
            loading="Updating asset with new metadata..."
            error={error}
            success={success}
            setError={setError}
            successAction={{
              name: 'Back to Asset',
              onClick: async () => {
                await fetchAsset()
              },
              to: `/asset/${asset.id}`
            }}
          />
        ) : (
          <>
            <FormEditMetadata
              data={content.form.data}
              showPrice={asset?.accessDetails?.type === 'fixed'}
              isComputeDataset={isComputeType}
            />

            <Web3Feedback
              networkId={asset?.chainId}
              isAssetNetwork={isAssetNetwork}
            />

            {debug === true && (
              <div className={styles.grid}>
                <DebugEditMetadata values={values} asset={asset} />
              </div>
            )}
          </>
        )
      }
    </Formik>
  )
}
