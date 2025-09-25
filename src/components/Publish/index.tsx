import React, { ReactElement, useState, useRef } from 'react'
import { Form, Formik } from 'formik'
import { initialPublishFeedback, initialValues } from './_constants'
import { useAccountPurgatory } from '@hooks/useAccountPurgatory'
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
import useNftFactory from '@hooks/useNftFactory'
import {
  ProviderInstance,
  LoggerInstance,
  getErrorMessage
} from '@oceanprotocol/lib'
import { DDO } from '@oceanprotocol/ddo-js'
import { getOceanConfig } from '@utils/ocean'
import { validationSchema } from './_validation'
import { useAbortController } from '@hooks/useAbortController'
import { setNFTMetadataAndTokenURI } from '@utils/nft'
import { customProviderUrl } from '../../../app.config.cjs'
import { useAccount, useNetwork, useSigner } from 'wagmi'

export default function PublishPage({
  content
}: {
  content: { title: string; description: string; warning: string }
}): ReactElement {
  const { debug } = useUserPreferences()
  const { address: accountId } = useAccount()
  const { data: signer } = useSigner()
  const { chain } = useNetwork()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)
  const scrollToRef = useRef()
  const nftFactory = useNftFactory()
  const newAbortController = useAbortController()

  const [feedback, setFeedback] = useState(initialPublishFeedback)

  // Collecting output of each publish step, enabling retry of failed steps
  const [erc721Address, setErc721Address] = useState<string>()
  const [datatokenAddress, setDatatokenAddress] = useState<string>()
  const [ddo, setDdo] = useState<DDO>()
  const [ddoEncrypted, setDdoEncrypted] = useState<string>()
  const [did, setDid] = useState<string>()

  // --------------------------------------------------
  // 1) Create NFT & DT & pricing
  // --------------------------------------------------
  async function create(
    values: FormPublishData
  ): Promise<{ erc721Address: string; datatokenAddress: string }> {
    setFeedback((prev) => ({
      ...prev,
      '1': { ...prev['1'], status: 'active', errorMessage: null }
    }))

    try {
      // ---------- contexto básico ----------
      LoggerInstance.log('[publish] chain?.id:', chain?.id)
      LoggerInstance.log('[publish] accountId:', accountId)
      LoggerInstance.log('[publish] nftFactory present:', Boolean(nftFactory))

      // Usa el chainId efectivo (Sepolia por defecto si aún no hay chain.id)
      const effectiveChainId =
        typeof chain?.id === 'number'
          ? chain.id
          : Number(process.env.NEXT_PUBLIC_CHAIN_IDS || 11155111)

      let config
      try {
        config = getOceanConfig(effectiveChainId)
      } catch (e: any) {
        LoggerInstance.error('[publish] getOceanConfig threw:', e?.message || e)
      }

      if (!config) {
        const msg = `[publish] no config for chainId=${effectiveChainId}. Aborting create().`
        LoggerInstance.error(msg)
        throw new Error(msg)
      }

      LoggerInstance.log('[publish] using config:', {
        chainId: config.chainId,
        nodeUri: config.nodeUri,
        metadataCacheUri: config.metadataCacheUri,
        subgraphUri: config.subgraphUri,
        providerUri: config.providerUri,
        nftFactoryAddress: config.nftFactoryAddress,
        fixedRateExchangeAddress: config.fixedRateExchangeAddress,
        dispenserAddress: config.dispenserAddress,
        oceanTokenAddress: config.oceanTokenAddress
      })

      // ---------- snapshot inputs relevantes ----------
      LoggerInstance.log('[publish] input snapshot:', {
        pricing: values.pricing,
        servicesProvider: values?.services?.[0]?.providerUrl?.url || '(none)'
      })

      // ---------- create tokens & pricing ----------
      const { erc721Address, datatokenAddress, txHash } =
        await createTokensAndPricing(values, accountId, config, nftFactory)

      const isSuccess = Boolean(erc721Address && datatokenAddress && txHash)
      if (!isSuccess) throw new Error('No Token created. Please try again.')

      LoggerInstance.log('[publish] tx sent/mined OK:', txHash)
      LoggerInstance.log('[publish] erc721Address:', erc721Address)
      LoggerInstance.log('[publish] datatokenAddress:', datatokenAddress)

      setFeedback((prev) => ({
        ...prev,
        '1': { ...prev['1'], status: 'success', txHash }
      }))

      return { erc721Address, datatokenAddress }
    } catch (error: any) {
      LoggerInstance.error(
        '[publish] error in create():',
        error?.message || error
      )
      if (error?.message?.length > 65) {
        error.message = 'No Token created. Please try again.'
      }
      setFeedback((prev) => ({
        ...prev,
        '1': { ...prev['1'], status: 'error', errorMessage: error.message }
      }))
      // para satisfacer el tipo, relanzamos; el caller (handleSubmit) ya captura el estado
      throw error
    }
  }

  // --------------------------------------------------
  // 2) Build & encrypt DDO
  // --------------------------------------------------
  async function encrypt(
    values: FormPublishData,
    erc721Address: string,
    datatokenAddress: string
  ): Promise<{ ddo: DDO; ddoEncrypted: string }> {
    setFeedback((prev) => ({
      ...prev,
      '2': { ...prev['2'], status: 'active', errorMessage: null }
    }))

    try {
      if (!datatokenAddress || !erc721Address) {
        throw new Error('No NFT or Datatoken received. Please try again.')
      }

      const ddo = await transformPublishFormToDdo(
        values,
        datatokenAddress,
        erc721Address
      )
      if (!ddo) throw new Error('No DDO received. Please try again.')

      setDdo(ddo)

      // LOG clave: inspeccionamos DDO mínimo necesario
      const svc = ddo?.services?.[0]
      LoggerInstance.log('[publish] DDO built:', {
        id: ddo?.id,
        chainId: ddo?.chainId,
        nftAddress: (ddo as any)?.nftAddress, // algunas builds lo traen
        servicesCount: ddo?.services?.length,
        firstService: {
          type: svc?.type,
          datatokenAddress: (svc as any)?.datatokenAddress,
          serviceEndpoint: svc?.serviceEndpoint
        }
      })

      // resolver provider que usaremos para encrypt
      const resolvedProviderUrl =
        customProviderUrl || values?.services?.[0]?.providerUrl?.url
      LoggerInstance.log('[publish] Provider for encrypt:', resolvedProviderUrl)

      let ddoEncrypted: string
      try {
        ddoEncrypted = await ProviderInstance.encrypt(
          ddo,
          ddo.chainId,
          resolvedProviderUrl,
          newAbortController()
        )
      } catch (e: any) {
        const message = getErrorMessage(e?.message)
        LoggerInstance.error('[Provider Encrypt] Error:', message)
      }

      if (!ddoEncrypted)
        throw new Error('No encrypted DDO received. Please try again.')

      setDdoEncrypted(ddoEncrypted)
      LoggerInstance.log('[publish] DDO encrypted length:', ddoEncrypted.length)

      setFeedback((prev) => ({
        ...prev,
        '2': { ...prev['2'], status: 'success' }
      }))

      return { ddo, ddoEncrypted }
    } catch (error: any) {
      LoggerInstance.error(
        '[publish] error in encrypt():',
        error?.message || error
      )
      setFeedback((prev) => ({
        ...prev,
        '2': { ...prev['2'], status: 'error', errorMessage: error.message }
      }))
    }
  }

  // --------------------------------------------------
  // 3) Write DDO into NFT metadata (on-chain)
  // --------------------------------------------------
  async function publish(
    values: FormPublishData,
    ddo: DDO,
    ddoEncrypted: string
  ): Promise<{ did: string }> {
    setFeedback((prev) => ({
      ...prev,
      '3': { ...prev['3'], status: 'active', errorMessage: null }
    }))

    try {
      if (!ddo || !ddoEncrypted) {
        throw new Error('No DDO received. Please try again.')
      }

      LoggerInstance.log('[publish] setNFTMetadataAndTokenURI =>', {
        did: ddo?.id,
        chainId: ddo?.chainId,
        nftAddress: (ddo as any)?.nftAddress,
        hasEncrypted: Boolean(ddoEncrypted)
      })

      const res = await setNFTMetadataAndTokenURI(
        ddo,
        accountId,
        signer,
        values.metadata.nft,
        newAbortController()
      )
      const tx = await res.wait()
      if (!tx?.transactionHash)
        throw new Error(
          'Metadata could not be written into the NFT. Please try again.'
        )

      LoggerInstance.log('[publish] setMetadata txHash:', tx?.transactionHash)

      setFeedback((prev) => ({
        ...prev,
        '3': {
          ...prev['3'],
          status: tx ? 'success' : 'error',
          txHash: tx?.transactionHash
        }
      }))

      return { did: ddo.id }
    } catch (error: any) {
      LoggerInstance.error(
        '[publish] error in publish():',
        error?.message || error
      )
      setFeedback((prev) => ({
        ...prev,
        '3': { ...prev['3'], status: 'error', errorMessage: error.message }
      }))
    }
  }

  // --------------------------------------------------
  // Orchestrate publishing
  // --------------------------------------------------
  async function handleSubmit(values: FormPublishData) {
    LoggerInstance.log('=== [publish] handleSubmit START ===')

    // Syncing variables with state, enabling retry of failed steps
    let _erc721Address = erc721Address
    let _datatokenAddress = datatokenAddress
    let _ddo = ddo
    let _ddoEncrypted = ddoEncrypted
    let _did = did

    if (!_erc721Address || !_datatokenAddress) {
      LoggerInstance.log('[publish] Step 1: create()')
      const result = await create(values)
      _erc721Address = result?.erc721Address
      _datatokenAddress = result?.datatokenAddress
      setErc721Address(_erc721Address)
      setDatatokenAddress(_datatokenAddress)
      LoggerInstance.log('[publish] Step 1 done:', {
        erc721: _erc721Address,
        datatoken: _datatokenAddress
      })
    }

    if (!_ddo || !_ddoEncrypted) {
      LoggerInstance.log('[publish] Step 2: encrypt()')
      const result = await encrypt(values, _erc721Address, _datatokenAddress)
      _ddo = result?.ddo
      _ddoEncrypted = result?.ddoEncrypted
      setDdo(_ddo)
      setDdoEncrypted(_ddoEncrypted)
      LoggerInstance.log('[publish] Step 2 done:', {
        did: _ddo?.id,
        hasEncrypted: Boolean(_ddoEncrypted)
      })
    }

    if (!_did) {
      LoggerInstance.log('[publish] Step 3: publish()')
      const result = await publish(values, _ddo, _ddoEncrypted)
      _did = result?.did
      setDid(_did)
      LoggerInstance.log('[publish] Step 3 done. DID:', _did)
    }

    LoggerInstance.log('=== [publish] handleSubmit END ===')
  }

  return isInPurgatory && purgatoryData ? null : (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
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
