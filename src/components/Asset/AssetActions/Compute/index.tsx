import React, { useState, ReactElement, useEffect, useCallback } from 'react'
import {
  LoggerInstance,
  ComputeAlgorithm,
  ComputeOutput,
  Asset,
  DDO,
  FileMetadata,
  Datatoken,
  ProviderInstance,
  ComputeAsset,
  ZERO_ADDRESS,
  ComputeEnvironment
} from '@oceanprotocol/lib'
import { toast } from 'react-toastify'
import Price from '@shared/Price'
import FileIcon from '@shared/FileIcon'
import Alert from '@shared/atoms/Alert'
import { useWeb3 } from '@context/Web3'
import { Formik } from 'formik'
import { getInitialValues, validationSchema } from './_constants'
import FormStartComputeDataset from './FormComputeDataset'
import styles from './index.module.css'
import SuccessConfetti from '@shared/SuccessConfetti'
import { getServiceByName, secondsToString } from '@utils/ddo'
import {
  isOrderable,
  getAlgorithmAssetSelectionList,
  getAlgorithmsForAsset,
  getValidUntilTime,
  getComputeEnviroment
} from '@utils/compute'
import { AssetSelectionAsset } from '@shared/FormFields/AssetSelection'
import AlgorithmDatasetsListForCompute from './AlgorithmDatasetsListForCompute'
import AssetActionHistoryTable from '../AssetActionHistoryTable'
import ComputeJobs from '../../../Profile/History/ComputeJobs'
import { useCancelToken } from '@hooks/useCancelToken'
import { useIsMounted } from '@hooks/useIsMounted'
import { Decimal } from 'decimal.js'
import { useAbortController } from '@hooks/useAbortController'
import { getOrderPriceAndFees } from '@utils/accessDetailsAndPricing'
import { OrderPriceAndFees } from 'src/@types/Price'
import { buyDtFromPool } from '@utils/pool'
import { order } from '@utils/order'
import { AssetExtended } from 'src/@types/AssetExtended'
import { getComputeFeedback } from '@utils/feedback'

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
  const [algorithmDTBalance, setAlgorithmDTBalance] = useState<string>()

  const [isOwned, setIsOwned] = useState(false)
  const [validOrderTx, setValidOrderTx] = useState('')
  const [isAlgorithmOwned, setIsAlgorithmOwned] = useState(false)
  const [validAlgorithmOrderTx, setValidAlgorithmOrderTx] = useState('')

  const hasDatatoken = Number(dtBalance) >= 1
  const isMounted = useIsMounted()
  const newCancelToken = useCancelToken()
  const [isConsumablePrice, setIsConsumablePrice] = useState(true)
  const [isAlgoConsumablePrice, setIsAlgoConsumablePrice] = useState(true)
  const [computeStatusText, setComputeStatusText] = useState('')
  const [computeEnv, setComputeEnv] = useState<ComputeEnvironment>()
  const [computeValidUntil, setComputeValidUntil] = useState<number>()
  const [datasetOrderPriceAndFees, setDatasetOrderPriceAndFees] =
    useState<OrderPriceAndFees>()
  const [isRequestingDataseOrderPrice, setIsRequestingDataseOrderPrice] =
    useState(false)
  const [algoOrderPriceAndFees, setAlgoOrderPriceAndFees] =
    useState<OrderPriceAndFees>()
  const [isRequestingAlgoOrderPrice, setIsRequestingAlgoOrderPrice] =
    useState(false)
  const isComputeButtonDisabled =
    isJobStarting === true ||
    file === null ||
    (!validOrderTx && !hasDatatoken && !isConsumablePrice) ||
    (!validAlgorithmOrderTx && !hasAlgoAssetDatatoken && !isAlgoConsumablePrice)

  async function checkAssetDTBalance(asset: DDO): Promise<boolean> {
    if (!asset?.services[0].datatokenAddress) return
    const datatokenInstance = new Datatoken(web3)
    const dtBalance = await datatokenInstance.balance(
      asset?.services[0].datatokenAddress,
      accountId
    )
    setAlgorithmDTBalance(new Decimal(dtBalance).toString())
    const hasAlgoDt = Number(dtBalance) >= 1
    setHasAlgoAssetDatatoken(hasAlgoDt)
    return hasAlgoDt
  }

  async function initPriceAndFees() {
    const computeEnv = await getComputeEnviroment(asset)
    setComputeEnv(computeEnv)
    const validUntil = getValidUntilTime(
      computeEnv?.maxJobDuration,
      asset.services[0].timeout,
      selectedAlgorithmAsset.services[0].timeout
    )
    setComputeValidUntil(validUntil)
    if (
      asset?.accessDetails?.addressOrId !== ZERO_ADDRESS ||
      asset?.accessDetails?.type !== 'free'
    ) {
      setIsRequestingDataseOrderPrice(true)
      setComputeStatusText(
        getComputeFeedback(
          asset.accessDetails.baseToken?.symbol,
          asset.accessDetails.datatoken?.symbol,
          asset.metadata.type
        )[0]
      )
      const datasetPriceAndFees = await getOrderPriceAndFees(
        asset,
        accountId,
        computeEnv?.id,
        validUntil
      )
      if (!datasetPriceAndFees) {
        setError('Error setting dataset price and fees!')
        toast.error('Error setting dataset price and fees!')
        return
      }
      setDatasetOrderPriceAndFees(datasetPriceAndFees)
      setIsRequestingDataseOrderPrice(false)
    }

    if (
      selectedAlgorithmAsset?.accessDetails?.addressOrId !== ZERO_ADDRESS ||
      selectedAlgorithmAsset?.accessDetails?.type !== 'free'
    ) {
      setIsRequestingAlgoOrderPrice(true)
      setComputeStatusText(
        getComputeFeedback(
          selectedAlgorithmAsset?.accessDetails?.baseToken?.symbol,
          selectedAlgorithmAsset?.accessDetails?.datatoken?.symbol,
          selectedAlgorithmAsset?.metadata?.type
        )[0]
      )
      const algorithmOrderPriceAndFees = await getOrderPriceAndFees(
        selectedAlgorithmAsset,
        ZERO_ADDRESS,
        computeEnv?.id,
        validUntil
      )
      if (!algorithmOrderPriceAndFees) {
        setError('Error setting algorithm price and fees!')
        toast.error('Error setting algorithm price and fees!')
        return
      }
      setAlgoOrderPriceAndFees(algorithmOrderPriceAndFees)
      setIsRequestingAlgoOrderPrice(false)
    }
  }

  useEffect(() => {
    if (!asset?.accessDetails || !accountId) return

    setIsConsumablePrice(asset?.accessDetails?.isPurchasable)
    setIsOwned(asset?.accessDetails?.isOwned)
    setValidOrderTx(asset?.accessDetails?.validOrderTx)
  }, [asset?.accessDetails])

  useEffect(() => {
    if (!selectedAlgorithmAsset?.accessDetails || !accountId) return

    setIsConsumablePrice(selectedAlgorithmAsset?.accessDetails?.isPurchasable)
    setIsAlgorithmOwned(selectedAlgorithmAsset?.accessDetails?.isOwned)
    setValidAlgorithmOrderTx(
      selectedAlgorithmAsset?.accessDetails?.validOrderTx
    )

    async function initSelectedAlgo() {
      await checkAssetDTBalance(selectedAlgorithmAsset)
      await initPriceAndFees()
    }

    initSelectedAlgo()
  }, [selectedAlgorithmAsset])

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

  async function startJob(): Promise<string> {
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

      let datasetOrderTx
      if (isOwned) {
        datasetOrderTx = validOrderTx
        LoggerInstance.log('[compute] Dataset owned txId:', validOrderTx)
      } else {
        try {
          if (!hasDatatoken && asset?.accessDetails.type === 'dynamic') {
            setComputeStatusText(
              getComputeFeedback(
                asset.accessDetails.baseToken?.symbol,
                asset.accessDetails.datatoken?.symbol,
                asset.metadata.type
              )[1]
            )
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
          LoggerInstance.log(
            'dataset orderPriceAndFees: ',
            datasetOrderPriceAndFees
          )
          setComputeStatusText(
            getComputeFeedback(
              asset.accessDetails.baseToken?.symbol,
              asset.accessDetails.datatoken?.symbol,
              asset.metadata.type
            )[asset.accessDetails?.type === 'fixed' ? 3 : 2]
          )
          const orderTx = await order(
            web3,
            asset,
            datasetOrderPriceAndFees,
            accountId,
            computeEnv?.id,
            computeValidUntil,
            computeEnv?.consumerAddress
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
          toast.error('Failed to order dataset asset!')
          return
        }
      }

      let algorithmOrderTx
      if (isAlgorithmOwned) {
        algorithmOrderTx = validAlgorithmOrderTx
        LoggerInstance.log(
          '[compute] Algorithm owned txId:',
          validAlgorithmOrderTx
        )
      } else {
        try {
          if (
            !hasAlgoAssetDatatoken &&
            selectedAlgorithmAsset?.accessDetails?.type === 'dynamic'
          ) {
            setComputeStatusText(
              getComputeFeedback(
                selectedAlgorithmAsset.accessDetails.baseToken?.symbol,
                selectedAlgorithmAsset.accessDetails.datatoken?.symbol,
                selectedAlgorithmAsset.metadata.type
              )[1]
            )
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
          setComputeStatusText(
            getComputeFeedback(
              selectedAlgorithmAsset.accessDetails.baseToken?.symbol,
              selectedAlgorithmAsset.accessDetails.datatoken?.symbol,
              selectedAlgorithmAsset.metadata.type
            )[selectedAlgorithmAsset.accessDetails?.type === 'fixed' ? 3 : 2]
          )
          const orderTx = await order(
            web3,
            selectedAlgorithmAsset,
            algoOrderPriceAndFees,
            accountId,
            computeEnv?.id,
            computeValidUntil,
            computeEnv?.consumerAddress
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
          toast.error('Failed to order algorithm asset!')
          return
        }
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
      setComputeStatusText(getComputeFeedback()[4])
      const response = await ProviderInstance.computeStart(
        asset.services[0].serviceEndpoint,
        web3,
        accountId,
        computeEnv?.id,
        computeAsset,
        computeAlgorithm,
        newAbortController(),
        null,
        output
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
            if (!values.algorithm) return
            await startJob()
          }}
        >
          <FormStartComputeDataset
            algorithms={algorithmList}
            ddoListAlgorithms={ddoAlgorithmList}
            selectedAlgorithmAsset={selectedAlgorithmAsset}
            setSelectedAlgorithm={setSelectedAlgorithmAsset}
            isLoading={
              isJobStarting ||
              isRequestingDataseOrderPrice ||
              isRequestingAlgoOrderPrice
            }
            isComputeButtonDisabled={isComputeButtonDisabled}
            hasPreviousOrder={validOrderTx !== undefined}
            hasDatatoken={hasDatatoken}
            dtBalance={dtBalance}
            datasetLowPoolLiquidity={!isConsumablePrice}
            assetType={asset?.metadata.type}
            assetTimeout={secondsToString(asset?.services[0].timeout)}
            hasPreviousOrderSelectedComputeAsset={
              validAlgorithmOrderTx !== undefined
            }
            hasDatatokenSelectedComputeAsset={hasAlgoAssetDatatoken}
            oceanSymbol={
              asset?.accessDetails
                ? asset?.accessDetails?.baseToken?.symbol
                : ''
            }
            dtSymbolSelectedComputeAsset={
              selectedAlgorithmAsset?.datatokens[0]?.symbol
            }
            dtBalanceSelectedComputeAsset={algorithmDTBalance}
            selectedComputeAssetLowPoolLiquidity={!isAlgoConsumablePrice}
            selectedComputeAssetType="algorithm"
            selectedComputeAssetTimeout={secondsToString(
              selectedAlgorithmAsset?.services[0]?.timeout
            )}
            // lazy comment when removing pricingStepText
            stepText={computeStatusText}
            isConsumable={isConsumable}
            consumableFeedback={consumableFeedback}
            datasetOrderPriceAndFees={datasetOrderPriceAndFees}
            algoOrderPriceAndFees={algoOrderPriceAndFees}
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
