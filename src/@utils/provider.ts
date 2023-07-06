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
  AbiItem
} from '@oceanprotocol/lib'
// if customProviderUrl is set, we need to call provider using this custom endpoint
import { customProviderUrl } from '../../app.config'
import { QueryHeader } from '@shared/FormInput/InputElement/Headers'
import { Signer } from 'ethers'
import { getValidUntilTime } from './compute'

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
      customProviderUrl || dataset.services[0].serviceEndpoint,
      accountId
    )
  } catch (error) {
    LoggerInstance.error(`Error initializing provider for the compute job!`)
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
    const response = await ProviderInstance.encrypt(
      files,
      chainId,
      customProviderUrl || providerUrl
    )
    return response
  } catch (error) {
    console.error('Error parsing json: ' + error.message)
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
      customProviderUrl || providerUrl,
      withChecksum
    )
    return response
  } catch (error) {
    LoggerInstance.error(error.message)
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
  try {
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

        response = await ProviderInstance.getFileInfo(
          fileIPFS,
          customProviderUrl || providerUrl
        )

        break
      }
      case 'arweave': {
        const fileArweave: Arweave = {
          type: storageType,
          transactionId: file
        }

        response = await ProviderInstance.getFileInfo(
          fileArweave,
          customProviderUrl || providerUrl
        )
        break
      }
      case 'graphql': {
        const fileGraphql: GraphqlQuery = {
          type: storageType,
          url: file,
          headers: headersProvider,
          query
        }

        response = await ProviderInstance.getFileInfo(fileGraphql, providerUrl)
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

        response = await ProviderInstance.getFileInfo(
          fileSmartContract,
          providerUrl
        )
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

        response = await ProviderInstance.getFileInfo(
          fileUrl,
          customProviderUrl || providerUrl
        )
        break
      }
    }
    return response
  } catch (error) {
    LoggerInstance.error(error.message)
  }
}

export async function downloadFile(
  signer: Signer,
  asset: AssetExtended,
  accountId: string,
  validOrderTx?: string
) {
  const downloadUrl = await ProviderInstance.getDownloadUrl(
    asset.id,
    asset.services[0].id,
    0,
    validOrderTx || asset.accessDetails.validOrderTx,
    customProviderUrl || asset.services[0].serviceEndpoint,
    signer
  )
  await downloadFileBrowser(downloadUrl)
}

export async function checkValidProvider(
  providerUrl: string
): Promise<boolean> {
  try {
    const response = await ProviderInstance.isValidProvider(providerUrl)
    return response
  } catch (error) {
    LoggerInstance.error(error.message)
  }
}
