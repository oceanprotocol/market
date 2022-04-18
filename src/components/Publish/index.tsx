import React, { ReactElement, useState, useRef } from 'react'
import { Form, Formik } from 'formik'
import { initialPublishFeedback, initialValues } from './_constants'
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
import { FormPublishData, PublishFeedback } from './_types'
import { useUserPreferences } from '@context/UserPreferences'
import useNftFactory from '@hooks/contracts/useNftFactory'
import { ProviderInstance, LoggerInstance, DDO } from '@oceanprotocol/lib'
import { getOceanConfig } from '@utils/ocean'
import { validationSchema } from './_validation'
import { useAbortController } from '@hooks/useAbortController'
import { setNFTMetadataAndTokenURI } from '@utils/nft'

// TODO: restore FormikPersist, add back clear form action
// const formName = 'ocean-publish-form'

export default function PublishPage({
  content
}: {
  content: { title: string; description: string; warning: string }
}): ReactElement {
  const { debug } = useUserPreferences()
  const { accountId, web3, chainId } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)
  const scrollToRef = useRef()
  const nftFactory = useNftFactory()
  const newAbortController = useAbortController()

  const [feedback, setFeedback] = useState<PublishFeedback>(
    initialPublishFeedback
  )
  const [did, setDid] = useState<string>()

  async function handleSubmit(values: FormPublishData) {
    let _erc721Address: string,
      _datatokenAddress: string,
      _ddo: DDO,
      _encryptedDdo: string

    // reset all feedback state
    setFeedback(initialPublishFeedback)

    // --------------------------------------------------
    // 1. Create NFT & datatokens & create pricing schema
    // --------------------------------------------------
    try {
      setFeedback((prevState) => ({
        ...prevState,
        '1': {
          ...prevState['1'],
          status: 'active',
          txCount: values.pricing.type === 'dynamic' ? 2 : 1,
          description:
            values.pricing.type === 'dynamic'
              ? prevState['1'].description.replace(
                  'a single transaction',
                  'a single transaction, after an initial approve transaction'
                )
              : prevState['1'].description
        }
      }))

      const config = getOceanConfig(chainId)
      LoggerInstance.log('[publish] using config: ', config)

      const { erc721Address, datatokenAddress, txHash } =
        await createTokensAndPricing(
          values,
          accountId,
          config,
          nftFactory,
          web3
        )

      const isSuccess = Boolean(erc721Address && datatokenAddress && txHash)
      _erc721Address = erc721Address
      _datatokenAddress = datatokenAddress

      LoggerInstance.log('[publish] createTokensAndPricing tx', txHash)
      LoggerInstance.log('[publish] erc721Address', erc721Address)
      LoggerInstance.log('[publish] datatokenAddress', datatokenAddress)

      setFeedback((prevState) => ({
        ...prevState,
        '1': {
          ...prevState['1'],
          status: isSuccess ? 'success' : 'error',
          txHash
        }
      }))
    } catch (error) {
      LoggerInstance.error('[publish] error', error.message)
      if (error.message.length > 65) {
        error.message = 'No Token created.'
      }

      setFeedback((prevState) => ({
        ...prevState,
        '1': {
          ...prevState['1'],
          status: 'error',
          errorMessage: error.message,
          description:
            values.pricing.type === 'dynamic'
              ? prevState['1'].description.replace(
                  'a single transaction',
                  'a single transaction, after an initial approve transaction'
                )
              : prevState['1'].description
        }
      }))
    }

    // --------------------------------------------------
    // 2. Construct and encrypt DDO
    // --------------------------------------------------
    try {
      setFeedback((prevState) => ({
        ...prevState,
        '2': {
          ...prevState['2'],
          status: 'active'
        }
      }))

      if (!_datatokenAddress || !_erc721Address)
        throw new Error('No NFT or Datatoken received.')

      const ddo = await transformPublishFormToDdo(
        values,
        _datatokenAddress,
        _erc721Address
      )

      _ddo = ddo
      LoggerInstance.log('[publish] Got new DDO', ddo)

      const encryptedResponse = await ProviderInstance.encrypt(
        ddo,
        values.services[0].providerUrl.url,
        newAbortController()
      )
      const encryptedDdo = encryptedResponse
      _encryptedDdo = encryptedDdo
      LoggerInstance.log('[publish] Got encrypted DDO', encryptedDdo)

      setFeedback((prevState) => ({
        ...prevState,
        '2': {
          ...prevState['2'],
          status: encryptedDdo ? 'success' : 'error'
        }
      }))
    } catch (error) {
      LoggerInstance.error('[publish] error', error.message)
      setFeedback((prevState) => ({
        ...prevState,
        '2': {
          ...prevState['2'],
          status: 'error',
          errorMessage: error.message
        }
      }))
    }

    // --------------------------------------------------
    // 3. Write DDO into NFT metadata
    // --------------------------------------------------
    try {
      setFeedback((prevState) => ({
        ...prevState,
        '3': {
          ...prevState['3'],
          status: 'active'
        }
      }))

      if (!_ddo || !_encryptedDdo) throw new Error('No DDO received.')

      const res = await setNFTMetadataAndTokenURI(
        _ddo,
        accountId,
        web3,
        values.metadata.nft,
        newAbortController()
      )

      LoggerInstance.log('[publish] setMetadata result', res)

      const txHash = res.transactionHash

      setFeedback((prevState) => ({
        ...prevState,
        '3': {
          ...prevState['3'],
          status: res ? 'success' : 'error',
          txHash
        }
      }))

      setDid(_ddo.id)
    } catch (error) {
      LoggerInstance.error('[publish] error', error.message)
      setFeedback((prevState) => ({
        ...prevState,
        '3': {
          ...prevState['3'],
          status: 'error',
          errorMessage: error.message
        }
      }))
    }
  }

  return isInPurgatory && purgatoryData ? null : (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
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
            <Steps feedback={feedback} />
            <Actions scrollToRef={scrollToRef} did={did} />
          </Form>
          {debug && <Debug />}
        </>
      )}
    </Formik>
  )
}
