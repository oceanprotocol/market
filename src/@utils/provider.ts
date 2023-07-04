import {
  Arweave,
  GraphqlQuery,
  Smartcontract,
  ComputeAlgorithm,
  ComputeAsset,
  ComputeEnvironment,
  downloadFileBrowser,
  FileInfo,
  Ipfs,
  LoggerInstance,
  ProviderComputeInitializeResults,
  ProviderInstance,
  UrlFile,
  AbiItem,
  getErrorMessage
} from '@oceanprotocol/lib'
import { QueryHeader } from '@shared/FormInput/InputElement/Headers'
import { Signer } from 'ethers'
import { getValidUntilTime } from './compute'
import { toast } from 'react-toastify'
import { tr } from 'date-fns/locale'

export async function initializeProviderForCompute(
  dataset: AssetExtended,
  algorithm: AssetExtended,
  accountId: string,
  computeEnv: ComputeEnvironment = null
): Promise<ProviderComputeInitializeResults> {
  const computeAsset: ComputeAsset = {
    documentId: dataset.id,
    serviceId: dataset.services[0].id,
    transferTxId: dataset.accessDetails.validOrderTx
  }
  const computeAlgo: ComputeAlgorithm = {
    documentId: algorithm.id,
    serviceId: algorithm.services[0].id,
    transferTxId: algorithm.accessDetails.validOrderTx
  }

  const validUntil = getValidUntilTime(
    computeEnv?.maxJobDuration,
    dataset.services[0].timeout,
    algorithm.services[0].timeout
  )

  try {
    return await ProviderInstance.initializeCompute(
      [computeAsset],
      computeAlgo,
      computeEnv?.id,
      validUntil,
      dataset.services[0].serviceEndpoint,
      accountId
    )
  } catch (error) {
    const message = getErrorMessage(JSON.parse(error.message))
    LoggerInstance.error('[Initialize Provider] Error:', message)
    toast.error(message)
    return null
  }
}

// TODO: Why do we have these one line functions ?!?!?!
export async function getEncryptedFiles(
  files: any,
  chainId: number,
  providerUrl: string
): Promise<string> {
  try {
    // https://github.com/oceanprotocol/provider/blob/v4main/API.md#encrypt-endpoint
    const response = await ProviderInstance.encrypt(files, chainId, providerUrl)
    return response
  } catch (error) {
    const message = getErrorMessage(JSON.parse(error.message))
    LoggerInstance.error('[Provider Encrypt] Error:', message)
    toast.error(message)
  }
}

export async function getFileDidInfo(
  did: string,
  serviceId: string,
  providerUrl: string,
  withChecksum = false
): Promise<FileInfo[]> {
  try {
    const response = await ProviderInstance.checkDidFiles(
      did,
      serviceId,
      providerUrl,
      withChecksum
    )
    return response
  } catch (error) {
    const message = getErrorMessage(JSON.parse(error.message))
    LoggerInstance.error('[Initialize check file did] Error:', message)
    toast.error(message)
  }
}

export async function getFileInfo(
  file: string,
  providerUrl: string,
  storageType: string,
  query?: string,
  headers?: QueryHeader[],
  abi?: string,
  chainId?: number,
  method?: string
): Promise<FileInfo[]> {
  let response
  const headersProvider = {}
  if (headers?.length > 0) {
    headers.map((el) => {
      headersProvider[el.key] = el.value
      return el
    })
  }

  switch (storageType) {
    case 'ipfs': {
      const fileIPFS: Ipfs = {
        type: storageType,
        hash: file
      }
      try {
        response = await ProviderInstance.getFileInfo(fileIPFS, providerUrl)
      } catch (error) {
        const message = getErrorMessage(JSON.parse(error.message))
        LoggerInstance.error('[Provider Get File info] Error:', message)
        toast.error(message)
      }
      break
    }
    case 'arweave': {
      const fileArweave: Arweave = {
        type: storageType,
        transactionId: file
      }
      try {
        response = await ProviderInstance.getFileInfo(fileArweave, providerUrl)
      } catch (error) {
        const message = getErrorMessage(JSON.parse(error.message))
        LoggerInstance.error('[Provider Get File info] Error:', message)
        toast.error(message)
      }
      break
    }
    case 'graphql': {
      const fileGraphql: GraphqlQuery = {
        type: storageType,
        url: file,
        headers: headersProvider,
        query
      }
      try {
        response = await ProviderInstance.getFileInfo(fileGraphql, providerUrl)
      } catch (error) {
        const message = getErrorMessage(JSON.parse(error.message))
        LoggerInstance.error('[Provider Get File info] Error:', message)
        toast.error(message)
      }
      break
    }
    case 'smartcontract': {
      // clean obj
      const fileSmartContract: Smartcontract = {
        chainId,
        type: storageType,
        address: file,
        abi: JSON.parse(abi) as AbiItem
      }
      try {
        response = await ProviderInstance.getFileInfo(
          fileSmartContract,
          providerUrl
        )
      } catch (error) {
        const message = getErrorMessage(JSON.parse(error.message))
        LoggerInstance.error('[Provider Get File info] Error:', message)
        toast.error(message)
      }
      break
    }
    default: {
      const fileUrl: UrlFile = {
        type: 'url',
        index: 0,
        url: file,
        headers: headersProvider,
        method
      }
      try {
        response = await ProviderInstance.getFileInfo(fileUrl, providerUrl)
      } catch (error) {
        const message = getErrorMessage(JSON.parse(error.message))
        LoggerInstance.error('[Provider Get File info] Error:', message)
        toast.error(message)
      }
      break
    }
  }
  return response
}

export async function downloadFile(
  signer: Signer,
  asset: AssetExtended,
  accountId: string,
  validOrderTx?: string
) {
  let downloadUrl
  try {
    downloadUrl = await ProviderInstance.getDownloadUrl(
      asset.id,
      asset.services[0].id,
      0,
      validOrderTx || asset.accessDetails.validOrderTx,
      asset.services[0].serviceEndpoint,
      signer
    )
  } catch (error) {
    const message = getErrorMessage(JSON.parse(error.message))
    LoggerInstance.error('[Provider Get download url] Error:', message)
    toast.error(message)
  }
  await downloadFileBrowser(downloadUrl)
}

export async function checkValidProvider(
  providerUrl: string
): Promise<boolean> {
  try {
    const response = await ProviderInstance.isValidProvider(providerUrl)
    return response
  } catch (error) {
    const message = getErrorMessage(JSON.parse(error.message))
    LoggerInstance.error('[Provider Check] Error:', message)
    toast.error(message)
  }
}
