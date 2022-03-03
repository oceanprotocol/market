import React, { useState, ReactElement, useEffect, useCallback } from 'react'
import {
  LoggerInstance,
  ComputeAlgorithm,
  ComputeOutput,
  Asset,
  DDO,
  PublisherTrustedAlgorithm,
  FileMetadata,
  Datatoken,
  ProviderInstance,
  ProviderFees,
  Pool,
  OrderParams,
  FreOrderParams,
  ComputeAsset,
  approve,
  TokenInOutMarket,
  AmountsInMaxFee,
  AmountsOutMaxFee,
  Service,
  ZERO_ADDRESS
} from '@oceanprotocol/lib'
import { toast } from 'react-toastify'
import Price from '@shared/Price'
import FileIcon from '@shared/FileIcon'
import Alert from '@shared/atoms/Alert'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import { useWeb3 } from '@context/Web3'
import {
  generateBaseQuery,
  getFilterTerm,
  queryMetadata
} from '@utils/aquarius'
import { Formik } from 'formik'
import { getInitialValues, validationSchema } from './_constants'
import axios from 'axios'
import FormStartComputeDataset from './FormComputeDataset'
import styles from './index.module.css'
import SuccessConfetti from '@shared/SuccessConfetti'
import { getServiceByName, secondsToString } from '@utils/ddo'
import {
  isOrderable,
  getAlgorithmAssetSelectionList,
  getAlgorithmsForAsset,
  getQuerryString,
  getValidUntilTime,
  getComputeEnviroment
} from '@utils/compute'
import AssetSelection, {
  AssetSelectionAsset
} from '@shared/FormFields/AssetSelection'
import AlgorithmDatasetsListForCompute from './AlgorithmDatasetsListForCompute'
import { getPreviousOrders } from '@utils/subgraph'
import AssetActionHistoryTable from '../AssetActionHistoryTable'
import ComputeJobs from '../../../Profile/History/ComputeJobs'
import { useCancelToken } from '@hooks/useCancelToken'
import { useIsMounted } from '@hooks/useIsMounted'
import { SortTermOptions } from '../../../../@types/aquarius/SearchQuery'
import { Decimal } from 'decimal.js'
import { TransactionReceipt } from 'web3-core'
import { useAbortController } from '@hooks/useAbortController'
import {
  getAccessDetails,
  getOrderPriceAndFees
} from '@utils/accessDetailsAndPricing'
import { AccessDetails, OrderPriceAndFees } from 'src/@types/Price'
import { transformAssetToAssetSelection } from '@utils/assetConvertor'
import { buyDtFromPool } from '@utils/pool'
import { order } from '@utils/order'
import { AssetExtended } from 'src/@types/AssetExtended'

export default function Compute({
  asset,
  dtBalance,
  file,
  fileIsLoading,
  isConsumable,
  consumableFeedback
}: {
  asset: AssetExtended
  dtBalance: string
  file: FileMetadata
  fileIsLoading?: boolean
  isConsumable?: boolean
  consumableFeedback?: string
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { accountId, web3 } = useWeb3()
  const [isJobStarting, setIsJobStarting] = useState(false)
  const [error, setError] = useState<string>()
  const newAbortController = useAbortController()

  const [algorithmList, setAlgorithmList] = useState<AssetSelectionAsset[]>()
  const [ddoAlgorithmList, setDdoAlgorithmList] = useState<Asset[]>()
  const [selectedAlgorithmAsset, setSelectedAlgorithmAsset] =
    useState<AssetExtended>()
  const [hasAlgoAssetDatatoken, setHasAlgoAssetDatatoken] = useState<boolean>()
  const [isPublished, setIsPublished] = useState(false)
  const [hasPreviousAlgorithmOrder, setHasPreviousAlgorithmOrder] =
    useState(false)
  const [algorithmDTBalance, setAlgorithmDTBalance] = useState<string>()
  const [algorithmConsumeDetails, setAlgorithmConsumeDetails] =
    useState<AccessDetails>()

  const [isOwned, setIsOwned] = useState(false)
  const [validOrderTx, setValidOrderTx] = useState('')
  const [orderPriceAndFees, setOrderPriceAndFees] =
    useState<OrderPriceAndFees>()
  const [isAlgorithmOwned, setIsAlgorithmOwned] = useState(false)
  const [validAlgorithmOrderTx, setValidAlgorithmOrderTx] = useState('')
  const [orderAlgorithmPriceAndFees, setOrderAlgorithmPriceAndFees] =
    useState<OrderPriceAndFees>()

  const [datasetTimeout, setDatasetTimeout] = useState<string>()
  const [algorithmTimeout, setAlgorithmTimeout] = useState<string>()
  const hasDatatoken = Number(dtBalance) >= 1
  const isMounted = useIsMounted()
  const newCancelToken = useCancelToken()
  const [isConsumablePrice, setIsConsumablePrice] = useState(true)
  const [isAlgoConsumablePrice, setIsAlgoConsumablePrice] = useState(true)
  const isComputeButtonDisabled =
    isJobStarting === true ||
    file === null ||
    (!validOrderTx && !hasDatatoken && !isConsumablePrice) ||
    (!hasPreviousAlgorithmOrder &&
      !hasAlgoAssetDatatoken &&
      !isAlgoConsumablePrice)

  async function checkAssetDTBalance(asset: DDO) {
    if (!asset?.services[0].datatokenAddress) return
    const datatokenInstance = new Datatoken(web3)
    const dtBalance = await datatokenInstance.balance(
      asset?.services[0].datatokenAddress,
      accountId
    )
    setAlgorithmDTBalance(new Decimal(dtBalance).toString())
    setHasAlgoAssetDatatoken(Number(dtBalance) >= 1)
  }

  useEffect(() => {
    if (!asset?.accessDetails || !accountId) return

    setIsConsumablePrice(asset?.accessDetails?.isPurchasable)
    setIsOwned(asset?.accessDetails?.isOwned)
    setValidOrderTx(asset?.accessDetails?.validOrderTx)

    async function init() {
      if (asset?.accessDetails?.addressOrId === ZERO_ADDRESS) return
      const validUntil = getValidUntilTime()
      const computeEnv = await getComputeEnviroment(asset)
      const orderPriceAndFees = await getOrderPriceAndFees(
        asset,
        computeEnv.id,
        validUntil,
        ZERO_ADDRESS
      )
      setOrderPriceAndFees(orderPriceAndFees)
    }
    init()
  }, [asset?.accessDetails])

  useEffect(() => {
    if (!selectedAlgorithmAsset?.accessDetails || !accountId) return

    checkAssetDTBalance(selectedAlgorithmAsset)
    setIsConsumablePrice(selectedAlgorithmAsset?.accessDetails?.isPurchasable)
    setIsAlgorithmOwned(selectedAlgorithmAsset?.accessDetails?.isOwned)
    setValidAlgorithmOrderTx(
      selectedAlgorithmAsset?.accessDetails?.validOrderTx
    )

    async function init() {
      if (selectedAlgorithmAsset?.accessDetails?.addressOrId === ZERO_ADDRESS)
        return
      const validUntil = getValidUntilTime()
      const computeEnv = await getComputeEnviroment(selectedAlgorithmAsset)
      const orderPriceAndFees = await getOrderPriceAndFees(
        selectedAlgorithmAsset,
        computeEnv.id,
        validUntil,
        ZERO_ADDRESS
      )
      setOrderAlgorithmPriceAndFees(orderPriceAndFees)
    }
    init()
  }, [selectedAlgorithmAsset])

  // useEffect(() => {
  //   setDatasetTimeout(secondsToString(timeout))
  // }, [ddo])

  useEffect(() => {
    if (!asset) return

    getAlgorithmsForAsset(asset, newCancelToken()).then((algorithmsAssets) => {
      setDdoAlgorithmList(algorithmsAssets)
      getAlgorithmAssetSelectionList(asset, algorithmsAssets).then(
        (algorithmSelectionList) => {
          setAlgorithmList(algorithmSelectionList)
        }
      )
    })
  }, [asset])

  // Output errors in toast UI
  useEffect(() => {
    const newError = error
    if (!newError) return
    toast.error(newError)
  }, [error])

  async function startJob(algorithmId: string): Promise<string> {
    try {
      setIsJobStarting(true)
      setIsPublished(false) // would be nice to rename this
      setError(undefined)
      const computeService = getServiceByName(asset, 'compute')
      const computeAlgorithm: ComputeAlgorithm = {
        documentId: selectedAlgorithmAsset.id,
        serviceId: selectedAlgorithmAsset.services[0].id
      }
      const allowed = await isOrderable(
        asset,
        computeService.id,
        computeAlgorithm,
        selectedAlgorithmAsset
      )
      LoggerInstance.log('[compute] Is data set orderable?', allowed)
      if (!allowed) {
        setError(
          'Data set is not orderable in combination with selected algorithm.'
        )
        LoggerInstance.error(
          '[compute] Error starting compute job. Dataset is not orderable in combination with selected algorithm.'
        )
        return
      }

      const validUntil = getValidUntilTime()
      const computeEnv = await getComputeEnviroment(asset)

      let datasetOrderTx
      if (!isOwned) {
        try {
          if (!hasDatatoken && asset?.accessDetails.type === 'dynamic') {
            const tx = await buyDtFromPool(
              asset?.accessDetails,
              accountId,
              web3
            )

            LoggerInstance.log('[compute] Buy dataset dt from pool: ', tx)
            if (!tx) {
              toast.error('Failed to buy datatoken from pool!')
              return
            }
          }
          LoggerInstance.log('dataset orderPriceAndFees: ', orderPriceAndFees)
          const orderTx = await order(
            web3,
            asset,
            orderPriceAndFees,
            accountId,
            computeEnv.id,
            validUntil,
            computeEnv.consumerAddress
          )
          if (!orderTx) {
            toast.error('Failed to order dataset asset!')
            return
          }
          LoggerInstance.log(
            '[compute] Order dataset: ',
            orderTx.transactionHash
          )
          setIsOwned(true)
          setValidOrderTx(orderTx.transactionHash)
          datasetOrderTx = orderTx.transactionHash
        } catch (e) {
          LoggerInstance.log(e.message)
        }
      } else {
        datasetOrderTx = validOrderTx
        LoggerInstance.log('[compute] Dataset owned txId:', validOrderTx)
      }

      let algorithmOrderTx
      if (!isAlgorithmOwned) {
        try {
          if (
            !hasAlgoAssetDatatoken &&
            selectedAlgorithmAsset?.accessDetails?.type === 'dynamic'
          ) {
            const tx = await buyDtFromPool(
              selectedAlgorithmAsset?.accessDetails,
              accountId,
              web3
            )
            LoggerInstance.log('[compute] Buy algorithm dt from pool: ', tx)
            if (!tx) {
              toast.error('Failed to buy datatoken from pool!')
              return
            }
          }
          LoggerInstance.log(
            'algorithm orderPriceAndFees: ',
            orderAlgorithmPriceAndFees
          )
          const orderTx = await order(
            web3,
            selectedAlgorithmAsset,
            orderAlgorithmPriceAndFees,
            accountId,
            computeEnv.id,
            validUntil,
            computeEnv.consumerAddress
          )
          if (!orderTx) {
            toast.error('Failed to order algorithm asset!')
            return
          }
          LoggerInstance.log(
            '[compute] Order algorithm: ',
            orderTx.transactionHash
          )
          setIsAlgorithmOwned(true)
          setValidAlgorithmOrderTx(orderTx.transactionHash)
          algorithmOrderTx = orderTx.transactionHash
        } catch (e) {
          LoggerInstance.log(e.message)
        }
      } else {
        algorithmOrderTx = validAlgorithmOrderTx
        LoggerInstance.log(
          '[compute] Algorithm owned txId:',
          validAlgorithmOrderTx
        )
      }

      LoggerInstance.log('[compute] Starting compute job.')
      const computeAsset: ComputeAsset = {
        documentId: asset.id,
        serviceId: asset.services[0].id,
        transferTxId: datasetOrderTx
      }
      computeAlgorithm.transferTxId = algorithmOrderTx
      const output: ComputeOutput = {
        publishAlgorithmLog: true,
        publishOutput: true
      }
      const response = await ProviderInstance.computeStart(
        asset.services[0].serviceEndpoint,
        web3,
        accountId,
        computeEnv.id,
        computeAsset,
        computeAlgorithm,
        newAbortController(),
        null,
        null
      )
      if (!response) {
        setError('Error starting compute job.')
        return
      }
      LoggerInstance.log('[compute] Starting compute job response: ', response)

      setIsPublished(true)
    } catch (error) {
      setError('Failed to start job!')
      LoggerInstance.error('[compute] Failed to start job: ', error.message)
    } finally {
      setIsJobStarting(false)
    }
  }

  return (
    <>
      <div className={styles.info}>
        <FileIcon file={file} isLoading={fileIsLoading} small />
        <Price accessDetails={asset?.accessDetails} conversion />
      </div>

      {asset.metadata.type === 'algorithm' ? (
        <>
          <Alert
            text="This algorithm has been set to private by the publisher and can't be downloaded. You can run it against any allowed data sets though!"
            state="info"
          />
          <AlgorithmDatasetsListForCompute
            algorithmDid={asset.id}
            asset={asset}
          />
        </>
      ) : (
        <Formik
          initialValues={getInitialValues()}
          validateOnMount
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await startJob(values.algorithm)
          }}
        >
          <FormStartComputeDataset
            algorithms={algorithmList}
            ddoListAlgorithms={ddoAlgorithmList}
            selectedAlgorithmAsset={selectedAlgorithmAsset}
            setSelectedAlgorithm={setSelectedAlgorithmAsset}
            isLoading={isJobStarting}
            isComputeButtonDisabled={isComputeButtonDisabled}
            hasPreviousOrder={validOrderTx !== ''}
            hasDatatoken={hasDatatoken}
            dtBalance={dtBalance}
            datasetLowPoolLiquidity={!isConsumablePrice}
            assetType={asset?.metadata.type}
            assetTimeout={datasetTimeout}
            hasPreviousOrderSelectedComputeAsset={hasPreviousAlgorithmOrder}
            hasDatatokenSelectedComputeAsset={hasAlgoAssetDatatoken}
            oceanSymbol={
              asset?.accessDetails ? asset?.accessDetails.baseToken.symbol : ''
            }
            dtSymbolSelectedComputeAsset={
              selectedAlgorithmAsset?.datatokens[0]?.symbol
            }
            dtBalanceSelectedComputeAsset={algorithmDTBalance}
            selectedComputeAssetLowPoolLiquidity={!isAlgoConsumablePrice}
            selectedComputeAssetType="algorithm"
            selectedComputeAssetTimeout={algorithmTimeout}
            // lazy comment when removing pricingStepText
            stepText={'pricingStepText' || 'Starting Compute Job...'}
            isConsumable={isConsumable}
            consumableFeedback={consumableFeedback}
          />
        </Formik>
      )}

      <footer className={styles.feedback}>
        {isPublished && (
          <SuccessConfetti success="Your job started successfully! Watch the progress below or on your profile." />
        )}
      </footer>
      {accountId && asset?.accessDetails?.datatoken && (
        <AssetActionHistoryTable title="Your Compute Jobs">
          <ComputeJobs minimal />
        </AssetActionHistoryTable>
      )}
    </>
  )
}
