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
  ProviderInstance
} from '@oceanprotocol/lib'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import Web3 from 'web3'
import axios from 'axios'
import { useCancelToken } from '@hooks/useCancelToken'

// TODO: restore FormikPersist, add back clear form action
const formName = 'ocean-publish-form'

async function fetchMethod(url: string): Promise<Response> {
  const result = await fetch(url)
  if (!result) {
    throw result.json()
  }
  return result
}
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
      const ocean = '0x8967BCF84170c91B0d24D4302C2376283b0B3a07'

      const nftCreateData: NftCreateData = {
        name: values.metadata.nft.name,
        symbol: values.metadata.nft.symbol,
        // tokenURI: values.metadata.nft.image,
        tokenURI: '',
        templateIndex: 1
      }

      const ercParams: Erc20CreateParams = {
        templateIndex: 1,
        minter: accountId,
        feeManager: accountId,
        mpFeeAddress: accountId,
        feeToken: ocean,
        feeAmount: `0`,
        cap: '1000',
        name: values.services[0].dataTokenOptions.name,
        symbol: values.services[0].dataTokenOptions.symbol
      }

      let erc721Address = ''
      let datatokenAddress = ''
      switch (values.pricing.type) {
        case 'dynamic': {
          const poolParams: PoolCreationParams = {
            //   ssContract: '0xeD8CA02627867f459593DD35bC2B0C465B9E9518',
            ssContract: '0xeD8CA02627867f459593DD35bC2B0C465B9E9518',
            basetokenAddress: ocean,
            basetokenSender: '0xa15024b732A8f2146423D14209eFd074e61964F3',
            publisherAddress: accountId,
            marketFeeCollector: accountId,
            poolTemplateAddress: '0x3B942aCcb370e92A07C3227f9fdAc058F62e68C0',
            rate: '1',
            basetokenDecimals: 18,
            vestingAmount: '0',
            vestedBlocks: 2726000,
            initialBasetokenLiquidity: '20',
            swapFeeLiquidityProvider: 1e15,
            swapFeeMarketPlaceRunner: 1e15
          }
          const token = new Datatoken(web3)
          token.approve(
            ocean,
            '0xa15024b732A8f2146423D14209eFd074e61964F3',
            '1000',
            accountId
          )
          const result = await nftFactory.createNftErcWithPool(
            accountId,
            nftCreateData,
            ercParams,
            poolParams
          )
          console.log('pool cre', result)
          ;[erc721Address] = result.events.NFTCreated.returnValues
          break
        }
        case 'fixed': {
          const freParams: FreCreationParams = {
            fixedRateAddress: `0x235C9bE4D23dCbd16c1Bf89ec839cb7C452FD9e9`,
            baseTokenAddress: ocean,
            owner: accountId,
            marketFeeCollector: appConfig.marketFeeAddress,
            baseTokenDecimals: 18,
            dataTokenDecimals: 18,
            fixedRate: '1',
            marketFee: 1,
            withMint: false
          }

          const result = await nftFactory.createNftErcWithFixedRate(
            accountId,
            nftCreateData,
            ercParams,
            freParams
          )
          console.log('create nft', result)
          console.log(
            'events',
            result.events.NFTCreated.returnValues,
            result.events.TokenCreated.returnValues
          )
          erc721Address = result.events.NFTCreated.returnValues[0]
          datatokenAddress = result.events.TokenCreated.returnValues[0]
          console.log('create address', erc721Address, datatokenAddress)
          break
        }
        case 'free': {
          // TODO: create dispenser here

          // console.log('params ', ercParams)
          // const result = await nftFactory.createNftWithErc(
          //   accountId,
          //   nftCreateData,
          //   ercParams
          // )
          // console.log('result', result.events.NFTCreated.returnValues[0])

          // const encrypted = await ProviderInstance.encrypt(
          //   '0xasdasda',
          //   accountId,
          //   values.metadata,
          //   'https://providerv4.rinkeby.oceanprotocol.com/',
          //   async (url: string) => {
          //     return (await axios.post(url, { cancelToken: newCancelToken() }))
          //       .data
          //   }
          // )
          // console.log('encrypted', encrypted)
          //  const published =

          // const nft = new Nft(web3)
          // const est = await nft.estSetTokenURI(
          //   result.events.NFTCreated.address,
          //   accountId,
          //   values.metadata.nft.image
          // )
          // console.log('est ', est)
          // const resss = await nft.setTokenURI(
          //   result.events.NFTCreated.address,
          //   accountId,
          //   values.metadata.nft.image
          // )
          break
        }
      }

      erc721Address = '0x7f9696ebfa882db0ac9f83fb0d2dca5b2edb4532'
      datatokenAddress = '0xa15024b732A8f2146423D14209eFd074e61964F3'
      const ddo = await transformPublishFormToDdo(
        values,
        datatokenAddress,
        erc721Address
      )
      console.log('formated ddo', JSON.stringify(ddo))
      const encryptedResponse = await ProviderInstance.encrypt(
        ddo.id,
        accountId,
        ddo,
        'https://providerv4.rinkeby.oceanprotocol.com/',
        (url: string, body: string) => {
          return axios.post(url, body, {
            headers: { 'Content-Type': 'application/octet-stream' },
            cancelToken: newCancelToken()
          })
        }
      )
      const encryptedDddo = encryptedResponse.data
      console.log('encrypted ddo', encryptedDddo)
      const metadataHash = getHash(JSON.stringify(ddo))
      const nft = new Nft(web3)

      const flags = Web3.utils.stringToHex('0')

      // const data = web3.utils.stringToHex(encryptedDddo)
      // const dataHash = web3.utils.stringToHex(metadataHash)
      // console.log('hex data', data)
      console.log('hex hash', metadataHash)
      console.log('hex flags', flags)
      const res = await nft.setMetadata(
        erc721Address,
        accountId,
        0,
        'https://providerv4.rinkeby.oceanprotocol.com/',
        '',
        '0x2',
        encryptedDddo,
        '0x' + metadataHash
      )
      console.log('res meta', res)

      // --------------------------------------------------
      // 1. Mint NFT & datatokens & put in pool
      // --------------------------------------------------
      // const nftOptions = values.metadata.nft
      // const nftCreateData = generateNftCreateData(nftOptions)

      // TODO: figure out syntax of ercParams we most likely need to pass
      // to createNftWithErc() as we need to pass options for the datatoken.
      // const ercParams = {}
      // const priceOptions = {
      //   // swapFee is tricky: to get 0.1% you need to send 0.001 as value
      //   swapFee: `${values.pricing.swapFee / 100}`
      // }
      // const txMint = await createNftWithErc(accountId, nftCreateData)

      // TODO: figure out how to get nftAddress & datatokenAddress from tx log.
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
