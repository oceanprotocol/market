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
import { FormPublishData } from './_types'
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

  // This `feedback` state is auto-synced into Formik context under `values.feedback`
  // for use in other components. Syncing defined in ./Steps.tsx child component.
  const [feedback, setFeedback] = useState(initialPublishFeedback)

  // Collecting output of each publish step, enabling retry of failed steps
  const [erc721Address, setErc721Address] = useState<string>()
  const [datatokenAddress, setDatatokenAddress] = useState<string>()
  const [ddo, setDdo] = useState<DDO>()
  const [ddoEncrypted, setDdoEncrypted] = useState<string>()
  const [did, setDid] = useState<string>()

  // --------------------------------------------------
  // 1. Create NFT & datatokens & create pricing schema
  // --------------------------------------------------
  async function create(values: FormPublishData): Promise<{
    erc721Address: string
    datatokenAddress: string
  }> {
    setFeedback((prevState) => ({
      ...prevState,
      '1': {
        ...prevState['1'],
        status: 'active',
        errorMessage: null
      }
    }))

    try {
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
      if (!isSuccess) throw new Error('No Token created. Please try again.')

      LoggerInstance.log('[publish] createTokensAndPricing tx', txHash)
      LoggerInstance.log('[publish] erc721Address', erc721Address)
      LoggerInstance.log('[publish] datatokenAddress', datatokenAddress)

      setFeedback((prevState) => ({
        ...prevState,
        '1': {
          ...prevState['1'],
          status: 'success',
          txHash
        }
      }))

      return { erc721Address, datatokenAddress }
    } catch (error) {
      LoggerInstance.error('[publish] error', error.message)
      if (error.message.length > 65) {
        error.message = 'No Token created. Please try again.'
      }

      setFeedback((prevState) => ({
        ...prevState,
        '1': {
          ...prevState['1'],
          status: 'error',
          errorMessage: error.message
        }
      }))
    }
  }

  // --------------------------------------------------
  // 2. Construct and encrypt DDO
  // --------------------------------------------------
  async function encrypt(
    values: FormPublishData,
    erc721Address: string,
    datatokenAddress: string
  ): Promise<{ ddo: DDO; ddoEncrypted: string }> {
    setFeedback((prevState) => ({
      ...prevState,
      '2': {
        ...prevState['2'],
        status: 'active',
        errorMessage: null
      }
    }))

    try {
      if (!datatokenAddress || !erc721Address)
        throw new Error('No NFT or Datatoken received. Please try again.')

      const ddo = await transformPublishFormToDdo(
        values,
        datatokenAddress,
        erc721Address
      )

      if (!ddo) throw new Error('No DDO received. Please try again.')

      setDdo(ddo)
      LoggerInstance.log('[publish] Got new DDO', ddo)

      const ddoEncrypted = await ProviderInstance.encrypt(
        ddo,
        values.services[0].providerUrl.url,
        newAbortController()
      )

      if (!ddoEncrypted)
        throw new Error('No encrypted DDO received. Please try again.')

      setDdoEncrypted(ddoEncrypted)
      LoggerInstance.log('[publish] Got encrypted DDO', ddoEncrypted)

      setFeedback((prevState) => ({
        ...prevState,
        '2': {
          ...prevState['2'],
          status: 'success'
        }
      }))

      return { ddo, ddoEncrypted }
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
  }

  // --------------------------------------------------
  // 3. Write DDO into NFT metadata
  // --------------------------------------------------
  async function publish(
    values: FormPublishData,
    ddo: DDO,
    ddoEncrypted: string
  ): Promise<{ did: string }> {
    setFeedback((prevState) => ({
      ...prevState,
      '3': {
        ...prevState['3'],
        status: 'active',
        errorMessage: null
      }
    }))

    try {
      if (!ddo || !ddoEncrypted)
        throw new Error('No DDO received. Please try again.')

      const res = await setNFTMetadataAndTokenURI(
        ddo,
        accountId,
        web3,
        values.metadata.nft,
        newAbortController()
      )
      if (!res?.transactionHash)
        throw new Error(
          'Metadata could not be written into the NFT. Please try again.'
        )

      LoggerInstance.log('[publish] setMetadata result', res)

      setFeedback((prevState) => ({
        ...prevState,
        '3': {
          ...prevState['3'],
          status: res ? 'success' : 'error',
          txHash: res?.transactionHash
        }
      }))

      return { did: ddo.id }
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

  // --------------------------------------------------
  // Orchestrate publishing
  // --------------------------------------------------
  async function handleSubmit(values: FormPublishData) {
    // Syncing variables with state, enabling retry of failed steps
    let _erc721Address = erc721Address
    let _datatokenAddress = datatokenAddress
    let _ddo = ddo
    let _ddoEncrypted = ddoEncrypted
    let _did = did

    if (!_erc721Address || !_datatokenAddress) {
      const { erc721Address, datatokenAddress } = await create(values)
      _erc721Address = erc721Address
      _datatokenAddress = datatokenAddress
      setErc721Address(erc721Address)
      setDatatokenAddress(datatokenAddress)
    }

    if (!_ddo || !_ddoEncrypted) {
      const { ddo, ddoEncrypted } = await encrypt(
        values,
        _erc721Address,
        _datatokenAddress
      )
      _ddo = ddo
      _ddoEncrypted = ddoEncrypted
      setDdo(ddo)
      setDdoEncrypted(ddoEncrypted)
    }

    if (!_did) {
      const { did } = await publish(values, _ddo, _ddoEncrypted)
      _did = did
      setDid(did)
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
