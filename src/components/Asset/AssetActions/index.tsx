import React, { ReactElement, useState, useEffect, useCallback } from 'react'
import Download from './Download'
import { FileInfo, LoggerInstance, Datatoken } from '@oceanprotocol/lib'
import { compareAsBN } from '@utils/numbers'
import { useAsset } from '@context/Asset'
import { getFileDidInfo, getFileInfo } from '@utils/provider'
import { getOceanConfig } from '@utils/ocean'
import { useCancelToken } from '@hooks/useCancelToken'
import { useIsMounted } from '@hooks/useIsMounted'
import styles from './index.module.css'
import { useFormikContext } from 'formik'
import { FormPublishData } from '@components/Publish/_types'
import { getTokenBalanceFromSymbol } from '@utils/wallet'
import AssetStats from './AssetStats'
import useBalance from '@hooks/useBalance'
import { useAppKitAccount, useAppKitNetworkCore } from '@reown/appkit/react'
import { useProvider } from '@hooks/useProvider'

// Simple in-memory cache for file metadata
const fileMetadataCache = new Map<string, FileInfo>()

export default React.memo(function AssetActions({
  asset
}: {
  asset: AssetExtended
}): ReactElement {
  const { address: accountId } = useAppKitAccount()
  const { balance } = useBalance()
  const { chainId } = useAppKitNetworkCore()
  const web3Provider = useProvider()
  const { isAssetNetwork } = useAsset()
  const newCancelToken = useCancelToken()
  const isMounted = useIsMounted()
  const formikValues = useFormikContext<FormPublishData>()

  const [isBalanceSufficient, setIsBalanceSufficient] = useState<boolean>()
  const [dtBalance, setDtBalance] = useState<string>()
  const [fileMetadata, setFileMetadata] = useState<FileInfo>()
  const [fileIsLoading, setFileIsLoading] = useState<boolean>(false)

  // Memoized file info initialization
  const initFileInfo = useCallback(async () => {
    const cacheKey = `${asset?.id}-${asset?.services[0]?.id}`
    if (fileMetadataCache.has(cacheKey)) {
      setFileMetadata(fileMetadataCache.get(cacheKey))
      return
    }

    const oceanConfig = getOceanConfig(asset?.chainId)
    if (!oceanConfig) return

    setFileIsLoading(true)
    const providerUrl =
      formikValues?.values.services[0].providerUrl.url ||
      asset?.services[0]?.serviceEndpoint

    const storageType = formikValues?.values.services
      ? formikValues?.values.services[0].files[0].type
      : null
    const file = formikValues?.values.services[0].files[0] as any
    const query = file?.query || undefined
    const abi = file?.abi || undefined
    const headers = file?.headers || undefined
    const method = file?.method || undefined

    try {
      const fileInfoResponse = formikValues?.values.services?.[0].files?.[0].url
        ? await getFileInfo(
            formikValues?.values.services?.[0].files?.[0].url,
            providerUrl,
            storageType,
            query,
            headers,
            abi,
            Number(chainId),
            method
          )
        : await getFileDidInfo(asset?.id, asset?.services[0]?.id, providerUrl)

      if (fileInfoResponse && isMounted()) {
        setFileMetadata(fileInfoResponse[0])
        fileMetadataCache.set(cacheKey, fileInfoResponse[0])

        // Update dataset schema
        const datasetSchema = document.scripts?.namedItem('datasetSchema')
        if (datasetSchema) {
          const datasetSchemaJSON = JSON.parse(datasetSchema.innerText)
          if (datasetSchemaJSON?.distribution[0]['@type'] === 'DataDownload') {
            datasetSchemaJSON.distribution[0].encodingFormat =
              fileInfoResponse[0]?.contentType
            datasetSchema.innerText = JSON.stringify(datasetSchemaJSON)
          }
        }
      }
    } catch (error) {
      LoggerInstance.error(error.message)
    } finally {
      if (isMounted()) setFileIsLoading(false)
    }
  }, [asset, formikValues, chainId, newCancelToken, isMounted])

  // Memoized datatoken balance initialization
  const initDtBalance = useCallback(async () => {
    if (
      !web3Provider ||
      !accountId ||
      !asset?.accessDetails?.baseToken?.address ||
      !isAssetNetwork
    )
      return

    try {
      const datatokenInstance = new Datatoken(web3Provider as any)
      const dtBalance = await datatokenInstance.balance(
        asset.accessDetails.baseToken.address,
        accountId
      )
      if (isMounted()) setDtBalance(dtBalance)
    } catch (e: any) {
      LoggerInstance.error('[DT Balance Error]', e.message || e)
    }
  }, [web3Provider, accountId, asset, isAssetNetwork, isMounted])

  // Fetch file info
  useEffect(() => {
    initFileInfo()
  }, [initFileInfo])

  // Fetch datatoken balance
  useEffect(() => {
    initDtBalance()
  }, [initDtBalance])

  // Check user balance against price
  useEffect(() => {
    if (asset?.accessDetails?.type === 'free') {
      setIsBalanceSufficient(true)
      return
    }

    if (
      !asset?.accessDetails?.price ||
      !asset?.accessDetails?.baseToken?.symbol ||
      !accountId ||
      !balance ||
      !dtBalance
    )
      return

    const baseTokenBalance = getTokenBalanceFromSymbol(
      balance,
      asset?.accessDetails?.baseToken?.symbol
    )
    const isSufficient =
      compareAsBN(baseTokenBalance, `${asset?.accessDetails.price}`) ||
      Number(dtBalance) >= 1

    if (isMounted()) setIsBalanceSufficient(isSufficient)

    return () => {
      if (isMounted()) setIsBalanceSufficient(false)
    }
  }, [balance, accountId, asset?.accessDetails, dtBalance, isMounted])

  return (
    <div className={styles.actions}>
      <Download
        asset={asset}
        dtBalance={dtBalance}
        isBalanceSufficient={isBalanceSufficient}
        file={fileMetadata}
        fileIsLoading={fileIsLoading}
        accessDetails={asset.accessDetails}
      />
      <AssetStats />
    </div>
  )
})
