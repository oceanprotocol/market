import React, { ReactElement, useState, useRef } from 'react'
import { Form, Formik } from 'formik'
import { initialValues } from './_constants'
import { useAccountPurgatory } from '@hooks/useAccountPurgatory'
import { useWeb3 } from '@context/Web3'
import { createTokensAndPricing, transformPublishFormToDdo } from './_utils'
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
import { Nft, getHash, ProviderInstance } from '@oceanprotocol/lib'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import axios, { Method } from 'axios'
import { useCancelToken } from '@hooks/useCancelToken'
import { getOceanConfig } from '@utils/ocean'
import { validationSchema } from './_validation'

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

      const { erc721Address, datatokenAddress } = await createTokensAndPricing(
        values,
        accountId,
        appConfig.marketFeeAddress,
        config,
        nftFactory,
        web3
      )

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
        values.services[0].providerUrl.url,
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
      validationSchema={validationSchema}
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
