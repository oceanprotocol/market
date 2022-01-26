import {
  approve,
  Config,
  DDO,
  Erc20CreateParams,
  FreCreationParams,
  generateDid,
  getHash,
  LoggerInstance,
  Metadata,
  NftCreateData,
  NftFactory,
  Pool,
  PoolCreationParams,
  Service,
  ZERO_ADDRESS
} from '@oceanprotocol/lib'
import { mapTimeoutStringToSeconds } from '@utils/ddo'
import { generateNftCreateData } from '@utils/nft'
import { getEncryptedFiles } from '@utils/provider'
import slugify from 'slugify'
import Web3 from 'web3'
import {
  algorithmContainerPresets,
  MetadataAlgorithmContainer
} from './_constants'
import { FormPublishData } from './_types'

export function getFieldContent(
  fieldName: string,
  fields: FormFieldContent[]
): FormFieldContent {
  return fields.filter((field: FormFieldContent) => field.name === fieldName)[0]
}

function getUrlFileExtension(fileUrl: string): string {
  const splittedFileUrl = fileUrl.split('.')
  return splittedFileUrl[splittedFileUrl.length - 1]
}

function getAlgorithmContainerPreset(
  dockerImage: string
): MetadataAlgorithmContainer {
  if (dockerImage === '') return

  const preset = algorithmContainerPresets.find(
    (preset) => `${preset.image}:${preset.tag}` === dockerImage
  )
  return preset
}

function dateToStringNoMS(date: Date): string {
  return date.toISOString().replace(/\.[0-9]{3}Z/, 'Z')
}

function transformTags(value: string): string[] {
  const originalTags = value?.split(',')
  const transformedTags = originalTags?.map((tag) => slugify(tag).toLowerCase())
  return transformedTags
}

export async function transformPublishFormToDdo(
  values: FormPublishData,
  // Those 2 are only passed during actual publishing process
  // so we can always assume if they are not passed, we are on preview.
  datatokenAddress?: string,
  nftAddress?: string
): Promise<DDO> {
  const { metadata, services, user } = values
  const { chainId, accountId } = user
  const {
    type,
    name,
    description,
    tags,
    author,
    termsAndConditions,
    dockerImage,
    dockerImageCustom,
    dockerImageCustomTag,
    dockerImageCustomEntrypoint,
    dockerImageCustomChecksum
  } = metadata
  const { access, files, links, providerUrl, timeout } = services[0]
  console.log('nft meta', generateNftCreateData(metadata.nft))
  const did = nftAddress ? generateDid(nftAddress, chainId) : '0x...'
  const currentTime = dateToStringNoMS(new Date())
  const isPreview = !datatokenAddress && !nftAddress
  console.log('did', did, isPreview)
  // Transform from files[0].url to string[] assuming only 1 file
  const filesTransformed = files?.length && files[0].valid && [files[0].url]
  const linksTransformed = links?.length && links[0].valid && [links[0].url]

  const newMetadata: Metadata = {
    created: currentTime,
    updated: currentTime,
    type,
    name,
    description,
    tags: transformTags(tags),
    author,
    license: 'https://market.oceanprotocol.com/terms',
    links: linksTransformed,
    additionalInformation: {
      termsAndConditions
    },
    ...(type === 'algorithm' &&
      dockerImage !== '' && {
        algorithm: {
          language: filesTransformed?.length
            ? getUrlFileExtension(filesTransformed[0])
            : '',
          version: '0.1',
          container: {
            entrypoint:
              dockerImage === 'custom'
                ? dockerImageCustomEntrypoint
                : getAlgorithmContainerPreset(dockerImage).entrypoint,
            image:
              dockerImage === 'custom'
                ? dockerImageCustom
                : getAlgorithmContainerPreset(dockerImage).image,
            tag:
              dockerImage === 'custom'
                ? dockerImageCustomTag
                : getAlgorithmContainerPreset(dockerImage).tag,
            checksum:
              dockerImage === 'custom'
                ? dockerImageCustomChecksum
                : getAlgorithmContainerPreset(dockerImage).checksum
          }
        }
      })
  }

  // this is the default format hardcoded
  const file = [
    {
      type: 'url',
      url: files[0].url,
      method: 'GET'
    }
  ]
  const filesEncrypted =
    !isPreview &&
    files?.length &&
    files[0].valid &&
    (await getEncryptedFiles(file, providerUrl.url))

  const newService: Service = {
    id: getHash(datatokenAddress + filesEncrypted),
    type: access,
    files: filesEncrypted || '',
    datatokenAddress,
    serviceEndpoint: providerUrl.url,
    timeout: mapTimeoutStringToSeconds(timeout),
    ...(access === 'compute' && {
      compute: values.services[0].computeOptions
    })
  }

  const newDdo: DDO = {
    '@context': ['https://w3id.org/did/v1'],
    id: did,
    nftAddress,
    version: '4.0.0',
    chainId,
    metadata: newMetadata,
    services: [newService],
    // Only added for DDO preview, reflecting Asset response,
    // again, we can assume if `datatokenAddress` is not passed,
    // we are on preview.
    ...(!datatokenAddress && {
      datatokens: [
        {
          name: values.services[0].dataTokenOptions.name,
          symbol: values.services[0].dataTokenOptions.symbol
        }
      ],
      nft: {
        owner: accountId
      }
    })
  }

  return newDdo
}

export async function createTokensAndPricing(
  values: FormPublishData,
  accountId: string,
  marketFeeAddress: string,
  config: Config,
  nftFactory: NftFactory,
  web3: Web3
) {
  const nftCreateData: NftCreateData = generateNftCreateData(
    values.metadata.nft
  )

  LoggerInstance.log('[publish] Creating NFT with metadata', nftCreateData)

  // TODO: cap is hardcoded for now to 1000, this needs to be discussed at some point
  // fee is default 0 for now
  // TODO: templateIndex is hardcoded for now but this is incorrect, in the future it should be something like 1 for pools, and 2 for fre and free
  const ercParams: Erc20CreateParams = {
    templateIndex: values.pricing.type === 'dynamic' ? 1 : 2,
    minter: accountId,
    feeManager: accountId,
    mpFeeAddress: marketFeeAddress,
    feeToken: config.oceanTokenAddress,
    feeAmount: `0`,
    cap: '1000',
    name: values.services[0].dataTokenOptions.name,
    symbol: values.services[0].dataTokenOptions.symbol
  }

  LoggerInstance.log('[publish] Creating datatoken with ercParams', ercParams)

  let erc721Address, datatokenAddress, txHash

  // TODO: cleaner code for this huge switch !??!?
  switch (values.pricing.type) {
    case 'dynamic': {
      // no vesting in market by default, maybe at a later time , vestingAmount and vestedBlocks are hardcoded
      // we use only ocean as basetoken
      // TODO: discuss swapFeeLiquidityProvider, swapFeeMarketPlaceRunner
      const poolParams: PoolCreationParams = {
        ssContract: config.sideStakingAddress,
        baseTokenAddress: config.oceanTokenAddress,
        baseTokenSender: config.erc721FactoryAddress,
        publisherAddress: accountId,
        marketFeeCollector: marketFeeAddress,
        poolTemplateAddress: config.poolTemplateAddress,
        rate: values.pricing.price.toString(),
        baseTokenDecimals: 18,
        vestingAmount: '0',
        vestedBlocks: 2726000,
        initialBaseTokenLiquidity: values.pricing.amountOcean.toString(),
        swapFeeLiquidityProvider: 1e15,
        swapFeeMarketRunner: 1e15
      }

      LoggerInstance.log(
        '[publish] Creating dynamic pricing with poolParams',
        poolParams
      )

      // the spender in this case is the erc721Factory because we are delegating
      const pool = new Pool(web3, LoggerInstance)
      const txApprove = await approve(
        web3,
        accountId,
        config.oceanTokenAddress,
        config.erc721FactoryAddress,
        '200',
        false
      )
      LoggerInstance.log('[publish] pool.approve tx', txApprove)

      const result = await nftFactory.createNftErcWithPool(
        accountId,
        nftCreateData,
        ercParams,
        poolParams
      )

      erc721Address = result.events.NFTCreated.returnValues[0]
      datatokenAddress = result.events.TokenCreated.returnValues[0]
      txHash = result.transactionHash

      LoggerInstance.log('[publish] createNftErcWithPool tx', txHash)
      break
    }
    case 'fixed': {
      const freParams: FreCreationParams = {
        fixedRateAddress: config.fixedRateExchangeAddress,
        baseTokenAddress: config.oceanTokenAddress,
        owner: accountId,
        marketFeeCollector: marketFeeAddress,
        baseTokenDecimals: 18,
        datatokenDecimals: 18,
        fixedRate: values.pricing.price.toString(),
        marketFee: 1e15,
        withMint: true
      }

      LoggerInstance.log(
        '[publish] Creating fixed pricing with freParams',
        freParams
      )

      const result = await nftFactory.createNftErcWithFixedRate(
        accountId,
        nftCreateData,
        ercParams,
        freParams
      )

      erc721Address = result.events.NFTCreated.returnValues[0]
      datatokenAddress = result.events.TokenCreated.returnValues[0]
      txHash = result.transactionHash

      LoggerInstance.log('[publish] createNftErcWithFixedRate tx', txHash)

      break
    }
    case 'free': {
      // maxTokens -  how many tokens cand be dispensed when someone requests . If maxTokens=2 then someone can't request 3 in one tx
      // maxBalance - how many dt the user has in it's wallet before the dispenser will not dispense dt
      // both will be just 1 for the market
      const dispenserParams = {
        dispenserAddress: config.dispenserAddress,
        maxTokens: web3.utils.toWei('1'),
        maxBalance: web3.utils.toWei('1'),
        withMint: true,
        allowedSwapper: ZERO_ADDRESS
      }

      LoggerInstance.log(
        '[publish] Creating free pricing with dispenserParams',
        dispenserParams
      )

      const result = await nftFactory.createNftErcWithDispenser(
        accountId,
        nftCreateData,
        ercParams,
        dispenserParams
      )
      erc721Address = result.events.NFTCreated.returnValues[0]
      datatokenAddress = result.events.TokenCreated.returnValues[0]
      txHash = result.transactionHash

      LoggerInstance.log('[publish] createNftErcWithDispenser tx', txHash)

      break
    }
  }

  return { erc721Address, datatokenAddress, txHash }
}
