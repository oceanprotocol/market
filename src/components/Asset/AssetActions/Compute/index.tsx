import React, { useState, ReactElement, useEffect } from 'react'
import {
  Asset,
  DDO,
  FileInfo,
  Datatoken,
  ProviderInstance,
  ComputeAsset,
  ZERO_ADDRESS,
  ComputeEnvironment,
  LoggerInstance,
  ComputeAlgorithm,
  ComputeOutput,
  ProviderComputeInitializeResults,
  unitsToAmount
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
  getComputeEnviroment
} from '@utils/compute'
import { AssetSelectionAsset } from '@shared/FormFields/AssetSelection'
import AlgorithmDatasetsListForCompute from './AlgorithmDatasetsListForCompute'
import AssetActionHistoryTable from '../AssetActionHistoryTable'
import ComputeJobs from '../../../Profile/History/ComputeJobs'
import { useCancelToken } from '@hooks/useCancelToken'
import { Decimal } from 'decimal.js'
import { useAbortController } from '@hooks/useAbortController'
import { getOrderPriceAndFees } from '@utils/accessDetailsAndPricing'
import { OrderPriceAndFees } from 'src/@types/Price'
import { handleComputeOrder } from '@utils/order'
import { AssetExtended } from 'src/@types/AssetExtended'
import { getComputeFeedback } from '@utils/feedback'
import { usePool } from '@context/Pool'
import { useMarketMetadata } from '@context/MarketMetadata'
import { getPoolData } from '@context/Pool/_utils'
import { getDummyWeb3 } from '@utils/web3'
import { initializeProviderForCompute } from '@utils/provider'

export default function Compute({
  asset,
  dtBalance,
  file,
  fileIsLoading,
  consumableFeedback
}: {
  asset: AssetExtended
  dtBalance: string
  file: FileInfo
  fileIsLoading?: boolean
  consumableFeedback?: string
}): ReactElement {
  const { accountId, web3 } = useWeb3()
  const { getOpcFeeForToken } = useMarketMetadata()
  const { poolData } = usePool()
  const newAbortController = useAbortController()
  const newCancelToken = useCancelToken()

  const [isOrdering, setIsOrdering] = useState(false)
  const [isOrdered, setIsOrdered] = useState(false)
  const [error, setError] = useState<string>()

  const [algorithmList, setAlgorithmList] = useState<AssetSelectionAsset[]>()
  const [ddoAlgorithmList, setDdoAlgorithmList] = useState<Asset[]>()
  const [selectedAlgorithmAsset, setSelectedAlgorithmAsset] =
    useState<AssetExtended>()
  const [hasAlgoAssetDatatoken, setHasAlgoAssetDatatoken] = useState<boolean>()
  const [algorithmDTBalance, setAlgorithmDTBalance] = useState<string>()

  const [validOrderTx, setValidOrderTx] = useState('')
  const [validAlgorithmOrderTx, setValidAlgorithmOrderTx] = useState('')

  const [isConsumablePrice, setIsConsumablePrice] = useState(true)
  const [isConsumableaAlgorithmPrice, setIsConsumableAlgorithmPrice] =
    useState(true)
  const [computeStatusText, setComputeStatusText] = useState('')
  const [computeEnv, setComputeEnv] = useState<ComputeEnvironment>()
  const [initializedProviderResponse, setInitializedProviderResponse] =
    useState<ProviderComputeInitializeResults>()
  const [providerFeeAmount, setProviderFeeAmount] = useState<string>('0')
  const [computeValidUntil, setComputeValidUntil] = useState<string>('0')
  const [datasetOrderPriceAndFees, setDatasetOrderPriceAndFees] =
    useState<OrderPriceAndFees>()
  const [algoOrderPriceAndFees, setAlgoOrderPriceAndFees] =
    useState<OrderPriceAndFees>()
  const [isRequestingAlgoOrderPrice, setIsRequestingAlgoOrderPrice] =
    useState(false)
  const [refetchJobs, setRefetchJobs] = useState(false)

  const hasDatatoken = Number(dtBalance) >= 1
  const isComputeButtonDisabled =
    isOrdering === true ||
    file === null ||
    (!validOrderTx && !hasDatatoken && !isConsumablePrice) ||
    (!validAlgorithmOrderTx &&
      !hasAlgoAssetDatatoken &&
      !isConsumableaAlgorithmPrice)

  async function checkAssetDTBalance(asset: DDO): Promise<boolean> {
    if (!asset?.services[0].datatokenAddress) return
    const web3 = await getDummyWeb3(asset?.chainId)
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
    try {
      const computeEnv = await getComputeEnviroment(asset)
      if (!computeEnv || !computeEnv.id)
        throw new Error(`Error getting compute environments!`)

      setComputeEnv(computeEnv)
      const initializedProvider = await initializeProviderForCompute(
        asset,
        selectedAlgorithmAsset,
        accountId,
        computeEnv
      )
      if (
        !initializedProvider ||
        !initializedProvider?.datasets ||
        !initializedProvider?.algorithm
      )
        throw new Error(`Error initializing provider for the compute job!`)

      setInitializedProviderResponse(initializedProvider)
      setProviderFeeAmount(
        await unitsToAmount(
          web3,
          initializedProvider?.datasets?.[0]?.providerFee?.providerFeeToken,
          initializedProvider?.datasets?.[0]?.providerFee?.providerFeeAmount
        )
      )
      const computeDuration = (
        parseInt(initializedProvider?.datasets?.[0]?.providerFee?.validUntil) -
        Math.floor(Date.now() / 1000)
      ).toString()
      setComputeValidUntil(computeDuration)

      if (
        asset?.accessDetails?.addressOrId !== ZERO_ADDRESS &&
        asset?.accessDetails?.type !== 'free' &&
        initializedProvider?.datasets?.[0]?.providerFee
      ) {
        setComputeStatusText(
          getComputeFeedback(
            asset.accessDetails?.baseToken?.symbol,
            asset.accessDetails?.datatoken?.symbol,
            asset.metadata.type
          )[0]
        )
        const poolParams =
          asset?.accessDetails?.type === 'dynamic'
            ? {
                tokenInLiquidity: poolData?.baseTokenLiquidity,
                tokenOutLiquidity: poolData?.datatokenLiquidity,
                tokenOutAmount: '1',
                opcFee: getOpcFeeForToken(
                  asset?.accessDetails?.baseToken.address,
                  asset?.chainId
                ),
                lpSwapFee: poolData?.liquidityProviderSwapFee,
                publishMarketSwapFee:
                  asset?.accessDetails?.publisherMarketOrderFee,
                consumeMarketSwapFee: '0'
              }
            : null
        const datasetPriceAndFees = await getOrderPriceAndFees(
          asset,
          ZERO_ADDRESS,
          poolParams,
          initializedProvider?.datasets?.[0]?.providerFee
        )
        if (!datasetPriceAndFees)
          throw new Error('Error setting dataset price and fees!')

        setDatasetOrderPriceAndFees(datasetPriceAndFees)
      }

      if (
        selectedAlgorithmAsset?.accessDetails?.addressOrId !== ZERO_ADDRESS &&
        selectedAlgorithmAsset?.accessDetails?.type !== 'free' &&
        initializedProvider?.algorithm?.providerFee
      ) {
        setComputeStatusText(
          getComputeFeedback(
            selectedAlgorithmAsset?.accessDetails?.baseToken?.symbol,
            selectedAlgorithmAsset?.accessDetails?.datatoken?.symbol,
            selectedAlgorithmAsset?.metadata?.type
          )[0]
        )
        let algoPoolParams = null
        if (selectedAlgorithmAsset?.accessDetails?.type === 'dynamic') {
          const response = await getPoolData(
            selectedAlgorithmAsset.chainId,
            selectedAlgorithmAsset.accessDetails?.addressOrId,
            selectedAlgorithmAsset?.nft.owner,
            accountId || ''
          )
          algoPoolParams = {
            tokenInLiquidity: response?.poolData?.baseTokenLiquidity,
            tokenOutLiquidity: response?.poolData?.datatokenLiquidity,
            tokenOutAmount: '1',
            opcFee: getOpcFeeForToken(
              selectedAlgorithmAsset?.accessDetails?.baseToken.address,
              selectedAlgorithmAsset?.chainId
            ),
            lpSwapFee: response?.poolData?.liquidityProviderSwapFee,
            publishMarketSwapFee:
              selectedAlgorithmAsset?.accessDetails?.publisherMarketOrderFee,
            consumeMarketSwapFee: '0'
          }
        }
        const algorithmOrderPriceAndFees = await getOrderPriceAndFees(
          selectedAlgorithmAsset,
          ZERO_ADDRESS,
          algoPoolParams,
          initializedProvider.algorithm.providerFee
        )
        if (!algorithmOrderPriceAndFees)
          throw new Error('Error setting algorithm price and fees!')

        setAlgoOrderPriceAndFees(algorithmOrderPriceAndFees)
      }
    } catch (error) {
      setError(error.message)
      LoggerInstance.error(`[compute] ${error.message} `)
    }
  }

  useEffect(() => {
    if (!asset?.accessDetails || !accountId) return

    setIsConsumablePrice(asset?.accessDetails?.isPurchasable)
    setValidOrderTx(asset?.accessDetails?.validOrderTx)
  }, [asset?.accessDetails, accountId])

  useEffect(() => {
    if (!selectedAlgorithmAsset?.accessDetails || !accountId) return

    setIsRequestingAlgoOrderPrice(true)
    setIsConsumableAlgorithmPrice(
      selectedAlgorithmAsset?.accessDetails?.isPurchasable
    )
    setValidAlgorithmOrderTx(
      selectedAlgorithmAsset?.accessDetails?.validOrderTx
    )
    setAlgoOrderPriceAndFees(null)

    async function initSelectedAlgo() {
      await checkAssetDTBalance(selectedAlgorithmAsset)
      await initPriceAndFees()
      setIsRequestingAlgoOrderPrice(false)
    }

    initSelectedAlgo()
  }, [selectedAlgorithmAsset, accountId])

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

  async function startJob(): Promise<void> {
    try {
      setIsOrdering(true)
      setIsOrdered(false)
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
      if (!allowed)
        throw new Error(
          'Data set is not orderable in combination with selected algorithm.'
        )

      await initPriceAndFees()

      setComputeStatusText(
        getComputeFeedback(
          selectedAlgorithmAsset.accessDetails.baseToken?.symbol,
          selectedAlgorithmAsset.accessDetails.datatoken?.symbol,
          selectedAlgorithmAsset.metadata.type
        )[
          selectedAlgorithmAsset.accessDetails?.type === 'fixed'
            ? 2
            : selectedAlgorithmAsset.accessDetails?.type === 'dynamic'
            ? 1
            : 3
        ]
      )

      const algorithmOrderTx = await handleComputeOrder(
        web3,
        selectedAlgorithmAsset,
        algoOrderPriceAndFees,
        accountId,
        hasAlgoAssetDatatoken,
        initializedProviderResponse.algorithm,
        computeEnv.consumerAddress
      )
      if (!algorithmOrderTx) throw new Error('Failed to order algorithm.')

      setComputeStatusText(
        getComputeFeedback(
          asset.accessDetails.baseToken?.symbol,
          asset.accessDetails.datatoken?.symbol,
          asset.metadata.type
        )[
          asset.accessDetails?.type === 'fixed'
            ? 2
            : asset.accessDetails?.type === 'dynamic'
            ? 1
            : 3
        ]
      )
      const datasetOrderTx = await handleComputeOrder(
        web3,
        asset,
        datasetOrderPriceAndFees,
        accountId,
        hasDatatoken,
        initializedProviderResponse.datasets[0],
        computeEnv.consumerAddress
      )
      if (!datasetOrderTx) throw new Error('Failed to order dataset.')

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
      if (!response) throw new Error('Error starting compute job.')

      LoggerInstance.log('[compute] Starting compute job response: ', response)
      setIsOrdered(true)
      setRefetchJobs(!refetchJobs)
      initPriceAndFees()
    } catch (error) {
      setError(error.message)
      LoggerInstance.error(`[compute] ${error.message} `)
    } finally {
      setIsOrdering(false)
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
            isLoading={isOrdering || isRequestingAlgoOrderPrice}
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
              asset?.accessDetails?.baseToken?.symbol ||
              selectedAlgorithmAsset?.accessDetails?.baseToken?.symbol ||
              'OCEAN'
            }
            dtSymbolSelectedComputeAsset={
              selectedAlgorithmAsset?.datatokens[0]?.symbol
            }
            dtBalanceSelectedComputeAsset={algorithmDTBalance}
            selectedComputeAssetType="algorithm"
            selectedComputeAssetTimeout={secondsToString(
              selectedAlgorithmAsset?.services[0]?.timeout
            )}
            // lazy comment when removing pricingStepText
            stepText={computeStatusText}
            isConsumable={isConsumablePrice}
            consumableFeedback={consumableFeedback}
            datasetOrderPriceAndFees={datasetOrderPriceAndFees}
            algoOrderPriceAndFees={algoOrderPriceAndFees}
            providerFeeAmount={providerFeeAmount}
            validUntil={computeValidUntil}
          />
        </Formik>
      )}

      <footer className={styles.feedback}>
        {isOrdered && (
          <SuccessConfetti success="Your job started successfully! Watch the progress below or on your profile." />
        )}
      </footer>
      {accountId && asset?.accessDetails?.datatoken && (
        <AssetActionHistoryTable title="Your Compute Jobs">
          <ComputeJobs
            minimal
            assetChainIds={[asset?.chainId]}
            refetchJobs={refetchJobs}
          />
        </AssetActionHistoryTable>
      )}
    </>
  )
}
