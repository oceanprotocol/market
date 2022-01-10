import React, { ReactElement, useState, useRef } from 'react'
import { Form, Formik } from 'formik'
import { initialValues } from './_constants'
import { useAccountPurgatory } from '@hooks/useAccountPurgatory'
import { useWeb3 } from '@context/Web3'
import { transformPublishFormToDdo } from './_utils'
import PageHeader from '@shared/Page/PageHeader'
import Title from './Title'
import styles from './index.module.css'
import Actions from './Actions'
import Debug from './Debug'
import Navigation from './Navigation'
import { Steps } from './Steps'
import { FormPublishData } from './_types'
import { useUserPreferences } from '@context/UserPreferences'
import useNftFactory from '@hooks/contracts/useNftFactory'
import {
  Datatoken,
  Nft,
  NftCreateData,
  getHash,
  Erc20CreateParams,
  FreCreationParams,
  PoolCreationParams,
  ProviderInstance,
  ZERO_ADDRESS,
  Pool,
  LoggerInstance
} from '@oceanprotocol/lib'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import Web3 from 'web3'
import axios, { Method } from 'axios'
import { useCancelToken } from '@hooks/useCancelToken'
import { getOceanConfig } from '@utils/ocean'

// TODO: restore FormikPersist, add back clear form action
const formName = 'ocean-publish-form'

export default function PublishPage({
  content
}: {
  content: { title: string; description: string; warning: string }
}): ReactElement {
  const { debug } = useUserPreferences()
  const { accountId, web3, chainId } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)

  // TODO: success & error states need to be handled for each step we want to display
  // most likely with a nested data structure.
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()
  const scrollToRef = useRef()
  const { appConfig } = useSiteMetadata()
  const nftFactory = useNftFactory()
  const newCancelToken = useCancelToken()

  async function handleSubmit(values: FormPublishData) {
    try {
      // --------------------------------------------------
      // 1. Create NFT & datatokens & create pricing schema
      // --------------------------------------------------

      const config = getOceanConfig(chainId)
      console.log('config', config)
      // image not included here for gas fees reasons. It is also an issue to reaserch how we add the image in the nft
      const nftCreateData: NftCreateData = {
        name: values.metadata.nft.name,
        symbol: values.metadata.nft.symbol,
        // tokenURI: values.metadata.nft.image,
        tokenURI: '',
        templateIndex: 1
      }

      // TODO: cap is hardcoded for now to 1000, this needs to be discussed at some point
      // fee is default 0 for now
      // TODO: templateIndex is hardcoded for now but this is incorrect, in the future it should be something like 1 for pools, and 2 for fre and free
      const ercParams: Erc20CreateParams = {
        templateIndex: values.pricing.type === 'dynamic' ? 1 : 2,
        minter: accountId,
        feeManager: accountId,
        mpFeeAddress: appConfig.marketFeeAddress,
        feeToken: config.oceanTokenAddress,
        feeAmount: `0`,
        cap: '1000',
        name: values.services[0].dataTokenOptions.name,
        symbol: values.services[0].dataTokenOptions.symbol
      }

      let erc721Address = ''
      let datatokenAddress = ''

      // TODO: cleaner code for this huge switch !??!?
      switch (values.pricing.type) {
        case 'dynamic': {
          // no vesting in market by default, maybe at a later time , vestingAmount and vestedBlocks are hardcoded
          // we use only ocean as basetoken
          // TODO: discuss swapFeeLiquidityProvider, swapFeeMarketPlaceRunner
          const poolParams: PoolCreationParams = {
            ssContract: config.sideStakingAddress,
            basetokenAddress: config.oceanTokenAddress,
            basetokenSender: config.erc721FactoryAddress,
            publisherAddress: accountId,
            marketFeeCollector: appConfig.marketFeeAddress,
            poolTemplateAddress: config.poolTemplateAddress,
            rate: values.pricing.price.toString(),
            basetokenDecimals: 18,
            vestingAmount: '0',
            vestedBlocks: 2726000,
            initialBasetokenLiquidity: values.pricing.amountOcean.toString(),
            swapFeeLiquidityProvider: 1e15,
            swapFeeMarketRunner: 1e15
          }
          // the spender in this case is the erc721Factory because we are delegating
          const pool = new Pool(web3, LoggerInstance)
          const txApp = await pool.approve(
            accountId,
            config.oceanTokenAddress,
            config.erc721FactoryAddress,
            '200',
            false
          )
          console.log('aprove', txApp)
          const result = await nftFactory.createNftErcWithPool(
            accountId,
            nftCreateData,
            ercParams,
            poolParams
          )

          erc721Address = result.events.NFTCreated.returnValues[0]
          datatokenAddress = result.events.TokenCreated.returnValues[0]
          break
        }
        case 'fixed': {
          const freParams: FreCreationParams = {
            fixedRateAddress: config.fixedRateExchangeAddress,
            baseTokenAddress: config.oceanTokenAddress,
            owner: accountId,
            marketFeeCollector: appConfig.marketFeeAddress,
            baseTokenDecimals: 18,
            dataTokenDecimals: 18,
            fixedRate: values.pricing.price.toString(),
            marketFee: 1e15,
            withMint: true
          }

          const result = await nftFactory.createNftErcWithFixedRate(
            accountId,
            nftCreateData,
            ercParams,
            freParams
          )

          erc721Address = result.events.NFTCreated.returnValues[0]
          datatokenAddress = result.events.TokenCreated.returnValues[0]

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
          const result = await nftFactory.createNftErcWithDispenser(
            accountId,
            nftCreateData,
            ercParams,
            dispenserParams
          )
          erc721Address = result.events.NFTCreated.returnValues[0]
          datatokenAddress = result.events.TokenCreated.returnValues[0]

          break
        }
      }

      // --------------------------------------------------
      // 2. Construct and publish DDO
      // --------------------------------------------------
      const ddo = await transformPublishFormToDdo(
        values,
        datatokenAddress,
        erc721Address
      )

      const encryptedResponse = await ProviderInstance.encrypt(
        ddo,
        config.providerUri,
        (httpMethod: Method, url: string, body: string, headers: any) => {
          return axios(url, {
            method: httpMethod,
            data: body,
            headers: headers,
            cancelToken: newCancelToken()
          })
        }
      )
      const encryptedDddo = encryptedResponse.data

      console.log('ddo', JSON.stringify(ddo))

      // TODO: this whole setMetadata needs to go in a function ,too many hardcoded/calculated params
      // TODO: hash generation : this needs to be moved in a function (probably on ocean.js) after we figure out what is going on in provider, leave it here for now
      const metadataHash = getHash(JSON.stringify(ddo))
      const nft = new Nft(web3)

      // theoretically used by aquarius or provider, not implemented yet, will remain hardcoded
      const flags = '0x2'

      const res = await nft.setMetadata(
        erc721Address,
        accountId,
        0,
        config.providerUri,
        '',
        flags,
        encryptedDddo,
        '0x' + metadataHash
      )

      console.log('result', res)

      // --------------------------------------------------
      // 3. Integrity check of DDO before & after publishing
      // --------------------------------------------------

      // TODO: not sure we want to do this at this step, seems overkill

      // if we want to do this we just need to fetch it from aquarius. If we want to fetch from chain and decrypt, we would have more metamask pop-ups (not UX friendly)
      // decrypt also validates the checksum

      // TODO: remove the commented lines of code until `setSuccess`, didn't remove them yet because maybe i missed something

      // --------------------------------------------------
      // 1. Mint NFT & datatokens & put in pool
      // --------------------------------------------------
      // const nftOptions = values.metadata.nft
      // const nftCreateData = generateNftCreateData(nftOptions)

      //  figure out syntax of ercParams we most likely need to pass
      // to createNftWithErc() as we need to pass options for the datatoken.
      // const ercParams = {}
      // const priceOptions = {
      //   // swapFee is tricky: to get 0.1% you need to send 0.001 as value
      //   swapFee: `${values.pricing.swapFee / 100}`
      // }
      // const txMint = await createNftWithErc(accountId, nftCreateData)

      // figure out how to get nftAddress & datatokenAddress from tx log.
      // const { nftAddress, datatokenAddress } = txMint.logs[0].args
      // if (!nftAddress || !datatokenAddress) { throw new Error() }
      //
      // --------------------------------------------------
      // 2. Construct and publish DDO
      // --------------------------------------------------
      // const did = sha256(`${nftAddress}${chainId}`)
      // const ddo = transformPublishFormToDdo(values, datatokenAddress, nftAddress)
      // const txPublish = await publish(ddo)
      //
      // --------------------------------------------------
      // 3. Integrity check of DDO before & after publishing
      // --------------------------------------------------
      // const checksumBefore = sha256(ddo)
      // const ddoFromChain = await getDdoFromChain(ddo.id)
      // const ddoFromChainDecrypted = await decryptDdo(ddoFromChain)
      // const checksumAfter = sha256(ddoFromChainDecrypted)

      // if (checksumBefore !== checksumAfter) {
      //   throw new Error('DDO integrity check failed!')
      // }
      setSuccess('Your DDO was published successfully!')
    } catch (error) {
      setError(error.message)
      console.log('err', error)
    }
  }

  return isInPurgatory && purgatoryData ? null : (
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        // kick off publishing
        await handleSubmit(values)
      }}
    >
      {({ values }) => (
        <>
          <PageHeader
            title={<Title networkId={values.user.chainId} />}
            description={content.description}
          />
          <Form className={styles.form} ref={scrollToRef}>
            <Navigation />
            <Steps />
            <Actions scrollToRef={scrollToRef} />
          </Form>
          {debug && <Debug />}
        </>
      )}
    </Formik>
  )
}
