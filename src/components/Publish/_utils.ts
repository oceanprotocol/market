import {
  approve,
  Config,
  DDO,
  Erc20CreateParams,
  FreCreationParams,
  generateDid,
  getHash,
  LoggerInstance,
  ProviderInstance,
  Metadata,
  NftCreateData,
  NftFactory,
  Nft,
  PoolCreationParams,
  Service,
  ZERO_ADDRESS
} from '@oceanprotocol/lib'
import { mapTimeoutStringToSeconds } from '@utils/ddo'
import { generateNftCreateData } from '@utils/nft'
import { getEncryptedFiles } from '@utils/provider'
import { getSiteMetadata } from '@utils/siteConfig'
import Decimal from 'decimal.js'
import slugify from 'slugify'
import Web3 from 'web3'
import {
  algorithmContainerPresets,
  MetadataAlgorithmContainer
} from './_constants'
import { FormPublishData } from './_types'
import { AssetExtended } from 'src/@types/AssetExtended'
import { getDummyWeb3 } from '@utils/web3'

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

  const did = nftAddress ? generateDid(nftAddress, chainId) : '0x...'
  const currentTime = dateToStringNoMS(new Date())
  const isPreview = !datatokenAddress && !nftAddress

  // Transform from files[0].url to string[] assuming only 1 file
  const filesTransformed = files?.length &&
    files[0].valid && [files[0].url.replace('javascript:', '')]
  const linksTransformed = links?.length &&
    links[0].valid && [links[0].url.replace('javascript:', '')]

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
  config: Config,
  nftFactory: NftFactory,
  web3: Web3
) {
  const nftCreateData: NftCreateData = generateNftCreateData(
    values.metadata.nft
  )
  const { appConfig } = getSiteMetadata()
  LoggerInstance.log('[publish] Creating NFT with metadata', nftCreateData)

  // TODO: cap is hardcoded for now to 1000, this needs to be discussed at some point
  const ercParams: Erc20CreateParams = {
    templateIndex: values.pricing.type === 'dynamic' ? 1 : 2,
    minter: accountId,
    feeManager: accountId,
    mpFeeAddress: appConfig.marketFeeAddress,
    feeToken: config.oceanTokenAddress,
    feeAmount: appConfig.publisherMarketOrderFee,
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
      // swapFeeLiquidityProvider is the swap fee of the liquidity providers
      // swapFeeMarketRunner is the swap fee of the market where the swap occurs
      const poolParams: PoolCreationParams = {
        ssContract: config.sideStakingAddress,
        baseTokenAddress: config.oceanTokenAddress,
        baseTokenSender: config.erc721FactoryAddress,
        publisherAddress: accountId,
        marketFeeCollector: appConfig.marketFeeAddress,
        poolTemplateAddress: config.poolTemplateAddress,
        rate: new Decimal(1).div(values.pricing.price).toString(),
        baseTokenDecimals: 18,
        vestingAmount: '0',
        vestedBlocks: 2726000,
        initialBaseTokenLiquidity: values.pricing.amountOcean.toString(),
        swapFeeLiquidityProvider: (values.pricing.swapFee / 100).toString(),
        swapFeeMarketRunner: appConfig.publisherMarketPoolSwapFee
      }

      LoggerInstance.log(
        '[publish] Creating dynamic pricing with poolParams',
        poolParams
      )

      // the spender in this case is the erc721Factory because we are delegating
      const txApprove = await approve(
        web3,
        accountId,
        config.oceanTokenAddress,
        config.erc721FactoryAddress,
        values.pricing.amountOcean.toString(),
        false
      )
      LoggerInstance.log('[publish] pool.approve tx', txApprove, nftFactory)

      const result = await nftFactory.createNftErc20WithPool(
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
        marketFeeCollector: appConfig.marketFeeAddress,
        baseTokenDecimals: 18,
        datatokenDecimals: 18,
        fixedRate: values.pricing.price.toString(),
        marketFee: appConfig.publisherMarketFixedSwapFee,
        withMint: true
      }

      LoggerInstance.log(
        '[publish] Creating fixed pricing with freParams',
        freParams
      )

      const result = await nftFactory.createNftErc20WithFixedRate(
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

      const result = await nftFactory.createNftErc20WithDispenser(
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

export async function getFeesTokensAndPricing(
  values: FormPublishData,
  accountId: string,
  config: Config,
  nftFactory: NftFactory,
  web3: Web3,
  ethToOceanConversionRate: number
) {
  if (!web3 && !values.user.chainId)
    throw new Error("web3 and chainId can't be undefined at the same time!")

  if (!web3) {
    web3 = await getDummyWeb3(values.user.chainId)
  }

  const nftCreateData: NftCreateData = generateNftCreateData(
    values.metadata.nft
  )
  const { appConfig } = getSiteMetadata()
  LoggerInstance.log('[gas fee] Creating NFT with metadata', nftCreateData)

  // TODO: cap is hardcoded for now to 1000, this needs to be discussed at some point
  const ercParams: Erc20CreateParams = {
    templateIndex: values.pricing.type === 'dynamic' ? 1 : 2,
    minter: accountId,
    feeManager: accountId,
    mpFeeAddress: appConfig.marketFeeAddress,
    feeToken: config.oceanTokenAddress,
    feeAmount: appConfig.publisherMarketOrderFee,
    cap: '1000',
    name: values.services[0].dataTokenOptions.name,
    symbol: values.services[0].dataTokenOptions.symbol
  }

  LoggerInstance.log('[gas fee] Creating datatoken with ercParams', ercParams)

  let gasEstimate

  switch (values.pricing.type) {
    case 'dynamic': {
      // no vesting in market by default, maybe at a later time , vestingAmount and vestedBlocks are hardcoded
      // we use only ocean as basetoken
      // swapFeeLiquidityProvider is the swap fee of the liquidity providers
      // swapFeeMarketRunner is the swap fee of the market where the swap occurs
      const poolParams: PoolCreationParams = {
        ssContract: config.sideStakingAddress,
        baseTokenAddress: config.oceanTokenAddress,
        baseTokenSender: config.erc721FactoryAddress,
        publisherAddress: accountId,
        marketFeeCollector: appConfig.marketFeeAddress,
        poolTemplateAddress: config.poolTemplateAddress,
        rate: new Decimal(1).div(values.pricing.price).toString(),
        baseTokenDecimals: 18,
        vestingAmount: '0',
        vestedBlocks: 2726000,
        initialBaseTokenLiquidity: values.pricing.amountOcean.toString(),
        swapFeeLiquidityProvider: (values.pricing.swapFee / 100).toString(),
        swapFeeMarketRunner: appConfig.publisherMarketPoolSwapFee
      }

      LoggerInstance.log(
        '[gas fee] Creating dynamic pricing with poolParams',
        poolParams
      )

      gasEstimate = await nftFactory.estGasCreateNftErc20WithPool(
        accountId,
        nftCreateData,
        ercParams,
        poolParams
      )

      LoggerInstance.log(
        '[gas fee] estGasCreateNftErc20WithPool tx',
        gasEstimate
      )
      break
    }
    case 'fixed': {
      const freParams: FreCreationParams = {
        fixedRateAddress: config.fixedRateExchangeAddress,
        baseTokenAddress: config.oceanTokenAddress,
        owner: accountId,
        marketFeeCollector: appConfig.marketFeeAddress,
        baseTokenDecimals: 18,
        datatokenDecimals: 18,
        fixedRate: values.pricing.price.toString(),
        marketFee: appConfig.publisherMarketFixedSwapFee,
        withMint: true
      }

      LoggerInstance.log(
        '[gas fee] Creating fixed pricing with freParams',
        freParams
      )

      gasEstimate = await nftFactory.estGasCreateNftErc20WithFixedRate(
        accountId,
        nftCreateData,
        ercParams,
        freParams
      )

      LoggerInstance.log(
        '[gas fee] estGasCreateNftErc20WithFixedRate tx',
        gasEstimate
      )

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
        '[gas fee] Creating free pricing with dispenserParams',
        dispenserParams
      )

      gasEstimate = await nftFactory.estGasCreateNftErc20WithDispenser(
        accountId,
        nftCreateData,
        ercParams,
        dispenserParams
      )

      LoggerInstance.log(
        '[gas fee] estGasCreateNftErc20WithDispenser tx',
        gasEstimate
      )

      break
    }
  }

  const gasPrice = await web3.eth.getGasPrice()

  const gasFee = web3.utils.fromWei(
    (+gasPrice * +gasEstimate).toString(),
    'ether'
  )

  const gasFeeOcean =
    ethToOceanConversionRate > 0
      ? (+gasFee / +ethToOceanConversionRate).toString()
      : ''
  return gasFeeOcean
}

export async function getFeesPublishDDO(
  values: FormPublishData,
  accountId: string,
  web3: Web3,
  ethToOceanConversionRate: number
) {
  if (!web3 && !values.user.chainId)
    throw new Error("web3 and chainId can't be undefined at the same time!")

  if (!web3) {
    web3 = await getDummyWeb3(values.user.chainId)
  }

  const { services } = values

  async function makeDdo() {
    // dummy DDO to calculate estGasSetMetadata
    const asset = (await transformPublishFormToDdo(values)) as AssetExtended
    asset.accessDetails = {
      type: values.pricing.type,
      addressOrId: ZERO_ADDRESS,
      price: values.pricing.price,
      baseToken: {
        address: ZERO_ADDRESS,
        name: 'OCEAN',
        symbol: 'OCEAN'
      },
      datatoken: {
        address: ZERO_ADDRESS,
        name: '',
        symbol: ''
      },
      isPurchasable: true,
      isOwned: false,
      validOrderTx: ''
    }
    return asset
  }

  const ddo = makeDdo()
  const metadataHash = getHash(JSON.stringify(ddo))
  const nft = new Nft(web3)

  LoggerInstance.log('[gas fee] Publish NFT with metadata', values)
  // theoretically used by aquarius or provider, not implemented yet, will remain hardcoded
  const flags = '0x2'

  const encryptedDdo = await ProviderInstance.encrypt(
    ddo,
    services['0'].providerUrl.url
  )

  const gasEstimate = await nft.estGasSetMetadata(
    '0xF620b6F6DE8f568FCb955d953886eDAE612e3f9B', // dummy address needed to calculate gas fees
    accountId,
    0,
    services['0'].providerUrl.url,
    '',
    flags,
    encryptedDdo,
    '0x' + metadataHash
  )

  const gasPrice = await web3.eth.getGasPrice()
  const gasFee = web3.utils.fromWei(
    (+gasPrice * +gasEstimate).toString(),
    'ether'
  )

  const gasFeeOcean =
    ethToOceanConversionRate > 0
      ? (+gasFee / +ethToOceanConversionRate).toString()
      : ''
  return gasFeeOcean
}
