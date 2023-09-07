import React, { ReactElement, useState, useEffect } from 'react'
import { Formik } from 'formik'
import {
  LoggerInstance,
  FixedRateExchange,
  Asset,
  Datatoken,
  Nft,
  Metadata,
  Service
} from '@oceanprotocol/lib'
import { validationSchema } from './_validation'
import { getInitialValues } from './_constants'
import { MetadataEditForm } from './_types'
import { useUserPreferences } from '@context/UserPreferences'
import Web3Feedback from '@shared/Web3Feedback'
import FormEditMetadata from './FormEditMetadata'
import { mapTimeoutStringToSeconds, normalizeFile } from '@utils/ddo'
import styles from './index.module.css'
import content from '../../../../content/pages/editMetadata.json'
import { useAbortController } from '@hooks/useAbortController'
import DebugEditMetadata from './DebugEditMetadata'
import { getOceanConfig, getPaymentCollector } from '@utils/ocean'
import EditFeedback from './EditFeedback'
import { useAsset } from '@context/Asset'
import { setNftMetadata } from '@utils/nft'
import { sanitizeUrl } from '@utils/url'
import { getEncryptedFiles } from '@utils/provider'
import { assetStateToNumber } from '@utils/assetState'
import { useAccount, useProvider, useNetwork, useSigner } from 'wagmi'
import { transformConsumerParameters } from '@components/Publish/_utils'

export default function Edit({
  asset
}: {
  asset: AssetExtended
}): ReactElement {
  const { debug } = useUserPreferences()
  const { fetchAsset, isAssetNetwork, assetState } = useAsset()
  const { address: accountId } = useAccount()
  const { chain } = useNetwork()
  const provider = useProvider()
  const { data: signer } = useSigner()
  const newAbortController = useAbortController()

  const [success, setSuccess] = useState<string>()
  const [paymentCollector, setPaymentCollector] = useState<string>()
  const [error, setError] = useState<string>()
  const isComputeType = asset?.services[0]?.type === 'compute'
  const hasFeedback = error || success

  useEffect(() => {
    if (!asset || !provider) return

    async function getInitialPaymentCollector() {
      try {
        const paymentCollector = await getPaymentCollector(
          asset.datatokens[0].address,
          provider
        )
        setPaymentCollector(paymentCollector)
      } catch (error) {
        LoggerInstance.error(
          '[EditMetadata: getInitialPaymentCollector]',
          error
        )
      }
    }
    getInitialPaymentCollector()
  }, [asset, provider])

  async function updateFixedPrice(newPrice: string) {
    const config = getOceanConfig(asset.chainId)

    const fixedRateInstance = new FixedRateExchange(
      config.fixedRateExchangeAddress,
      signer
    )

    const setPriceResp = await fixedRateInstance.setRate(
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
        author: values.author,
        tags: values.tags
      }

      if (asset.metadata.type === 'algorithm') {
        updatedMetadata.algorithm.consumerParameters =
          !values.usesConsumerParameters
            ? undefined
            : transformConsumerParameters(values.consumerParameters)
      }

      asset?.accessDetails?.type === 'fixed' &&
        values.price !== asset.accessDetails.price &&
        (await updateFixedPrice(values.price))

      if (values.paymentCollector !== paymentCollector) {
        const datatoken = new Datatoken(signer)
        await datatoken.setPaymentCollector(
          asset?.datatokens[0].address,
          accountId,
          values.paymentCollector
        )
      }

      if (values.files[0]?.url) {
        const file = {
          nftAddress: asset.nftAddress,
          datatokenAddress: asset.services[0].datatokenAddress,
          files: [
            normalizeFile(values.files[0].type, values.files[0], chain?.id)
          ]
        }

        const filesEncrypted = await getEncryptedFiles(
          file,
          asset.chainId,
          asset.services[0].serviceEndpoint
        )
        updatedFiles = filesEncrypted
      }
      const updatedService: Service = {
        ...asset.services[0],
        timeout: mapTimeoutStringToSeconds(values.timeout),
        files: updatedFiles
      }
      if (values?.service?.consumerParameters) {
        updatedService.consumerParameters = transformConsumerParameters(
          values.service.consumerParameters
        )
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
        signer,
        newAbortController()
      )

      if (values.assetState !== assetState) {
        const nft = new Nft(signer)

        await nft.setMetadataState(
          asset?.nftAddress,
          accountId,
          assetStateToNumber(values.assetState)
        )
      }

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
        asset?.services[0],
        asset?.accessDetails?.price || '0',
        paymentCollector,
        assetState
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
              accountId={accountId}
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
