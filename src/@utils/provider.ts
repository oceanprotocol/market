import {
  Arweave,
  ComputeAlgorithm,
  ComputeAsset,
  ComputeEnvironment,
  downloadFileBrowser,
  FileInfo,
  Ipfs,
  GraphqlQuery,
  LoggerInstance,
  ProviderComputeInitializeResults,
  ProviderInstance,
  Smartcontract,
  UrlFile
} from '@oceanprotocol/lib'
import Web3 from 'web3'
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
      dataset.services[0].serviceEndpoint,
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
  providerUrl: string
): Promise<string> {
  try {
    // https://github.com/oceanprotocol/provider/blob/v4main/API.md#encrypt-endpoint
    const response = await ProviderInstance.encrypt(files, providerUrl)
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
      providerUrl,
      withChecksum
    )
    return response
  } catch (error) {
    LoggerInstance.error(error.message)
  }
}

export async function getFileUrlInfo(
  url: string,
  providerUrl: string,
  storageType: string
): Promise<any[]> {
  try {
    let response
    switch (storageType) {
      case 'ipfs':
        // eslint-disable-next-line no-case-declarations
        const fileIPFS: Ipfs = {
          type: 'ipfs',
          hash: url
        }

        response = await ProviderInstance.getFileInfo(fileIPFS, providerUrl)
        console.log(response, fileIPFS)

        break
      case 'arweave':
        // eslint-disable-next-line no-case-declarations
        const fileArweave: Arweave = {
          type: 'arweave',
          transactionId: url
        }

        response = await ProviderInstance.getFileInfo(fileArweave, providerUrl)
        break
      case 'graphql':
        // eslint-disable-next-line no-case-declarations
        const fileGraphql: GraphqlQuery = {
          type: 'graphql',
          url: 'http://172.15.0.15:8000/subgraphs/name/oceanprotocol/ocean-subgraph',
          query: `
            query{
              nfts(orderBy: createdTimestamp,orderDirection:desc){
                  id
                  symbol
                  createdTimestamp
              }
            }
          `
        }

        response = await ProviderInstance.getFileInfo(fileGraphql, providerUrl)
        break
      case 'smartcontract':
        // eslint-disable-next-line no-case-declarations
        const fileSmartcontract: Smartcontract = {
          type: 'smartcontract',
          address: '0x8149276f275EEFAc110D74AFE8AFECEaeC7d1593',
          chainId: 0,
          abi: {
            inputs: [],
            name: 'swapOceanFee',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function'
          }
        }

        response = await ProviderInstance.getFileInfo(
          fileSmartcontract,
          providerUrl
        )
        break
      default:
        // eslint-disable-next-line no-case-declarations
        const fileUrl: UrlFile = {
          type: 'url',
          index: 0,
          url,
          method: 'get'
        }

        response = await ProviderInstance.getFileInfo(fileUrl, providerUrl)
        break
    }
    return response
  } catch (error) {
    LoggerInstance.error(error.message)
  }
}

export async function downloadFile(
  web3: Web3,
  asset: AssetExtended,
  accountId: string,
  validOrderTx?: string
) {
  const downloadUrl = await ProviderInstance.getDownloadUrl(
    asset.id,
    accountId,
    asset.services[0].id,
    0,
    validOrderTx || asset.accessDetails.validOrderTx,
    asset.services[0].serviceEndpoint,
    web3
  )
  await downloadFileBrowser(downloadUrl)
}
