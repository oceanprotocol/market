import React, { useState, ReactElement, useEffect, useCallback } from 'react'
import {
  LoggerInstance,
  ComputeAlgorithm,
  ComputeOutput,
  Asset,
  DDO,
  PublisherTrustedAlgorithm,
  FileMetadata,
  Datatoken
} from '@oceanprotocol/lib'
import { toast } from 'react-toastify'
import Price from '@shared/Price'
import FileIcon from '@shared/FileIcon'
import Alert from '@shared/atoms/Alert'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import { useWeb3 } from '@context/Web3'
import { usePricing } from '@hooks/usePricing'
import {
  generateBaseQuery,
  getFilterTerm,
  queryMetadata,
  transformDDOToAssetSelection
} from '@utils/aquarius'
import { Formik } from 'formik'
import { getInitialValues, validationSchema } from './_constants'
import axios from 'axios'
import FormStartComputeDataset from './FormComputeDataset'
import styles from './index.module.css'
import SuccessConfetti from '@shared/SuccessConfetti'
import { getServiceByName, secondsToString } from '@utils/ddo'
import { isOrderable } from '@utils/compute'
import { AssetSelectionAsset } from '@shared/FormFields/AssetSelection'
import AlgorithmDatasetsListForCompute from './AlgorithmDatasetsListForCompute'
import { getPreviousOrders, getPrice } from '@utils/subgraph'
import AssetActionHistoryTable from '../AssetActionHistoryTable'
import ComputeJobs from '../../../Profile/History/ComputeJobs'
import { useCancelToken } from '@hooks/useCancelToken'
import { useIsMounted } from '@hooks/useIsMounted'
import { SortTermOptions } from '../../../../@types/aquarius/SearchQuery'
import { Decimal } from 'decimal.js'

export default function Compute({
  ddo,
  price,
  dtBalance,
  file,
  fileIsLoading,
  isConsumable,
  consumableFeedback
}: {
  ddo: Asset
  price: BestPrice
  dtBalance: string
  file: FileMetadata
  fileIsLoading?: boolean
  isConsumable?: boolean
  consumableFeedback?: string
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { accountId, web3 } = useWeb3()
  const { buyDT, pricingError, pricingStepText } = usePricing()
  const [isJobStarting, setIsJobStarting] = useState(false)
  const [error, setError] = useState<string>()

  const [algorithmList, setAlgorithmList] = useState<AssetSelectionAsset[]>()
  const [ddoAlgorithmList, setDdoAlgorithmList] = useState<Asset[]>()
  const [selectedAlgorithmAsset, setSelectedAlgorithmAsset] = useState<Asset>()
  const [hasAlgoAssetDatatoken, setHasAlgoAssetDatatoken] = useState<boolean>()
  const [isPublished, setIsPublished] = useState(false)
  const [hasPreviousDatasetOrder, setHasPreviousDatasetOrder] = useState(false)
  const [previousDatasetOrderId, setPreviousDatasetOrderId] = useState<string>()
  const [hasPreviousAlgorithmOrder, setHasPreviousAlgorithmOrder] =
    useState(false)
  const [algorithmDTBalance, setAlgorithmDTBalance] = useState<string>()
  const [algorithmPrice, setAlgorithmPrice] = useState<BestPrice>()
  const [previousAlgorithmOrderId, setPreviousAlgorithmOrderId] =
    useState<string>()
  const [datasetTimeout, setDatasetTimeout] = useState<string>()
  const [algorithmTimeout, setAlgorithmTimeout] = useState<string>()
  const newCancelToken = useCancelToken()
  const hasDatatoken = Number(dtBalance) >= 1
  const isMounted = useIsMounted()
  const [isConsumablePrice, setIsConsumablePrice] = useState(true)
  const [isAlgoConsumablePrice, setIsAlgoConsumablePrice] = useState(true)
  const isComputeButtonDisabled =
    isJobStarting === true ||
    file === null ||
    (!hasPreviousDatasetOrder && !hasDatatoken && !isConsumablePrice) ||
    (!hasPreviousAlgorithmOrder &&
      !hasAlgoAssetDatatoken &&
      !isAlgoConsumablePrice)

  const { timeout } = ddo?.services[0]

  async function checkPreviousOrders(ddo: DDO) {
    const { type } = ddo.metadata

    const orderId = await getPreviousOrders(
      ddo.services[0].datatokenAddress?.toLowerCase(),
      accountId?.toLowerCase(),
      timeout.toString()
    )

    if (!isMounted()) return
    if (type === 'algorithm') {
      setPreviousAlgorithmOrderId(orderId)
      setHasPreviousAlgorithmOrder(!!orderId)
    } else {
      setPreviousDatasetOrderId(orderId)
      setHasPreviousDatasetOrder(!!orderId)
    }
  }

  async function checkAssetDTBalance(asset: DDO) {
    const datatokenInstance = new Datatoken(web3)
    const AssetDtBalance = await datatokenInstance.balance(
      asset.services[0].datatokenAddress,
      accountId
    )
    setAlgorithmDTBalance(new Decimal(AssetDtBalance).toString())
    setHasAlgoAssetDatatoken(Number(AssetDtBalance) >= 1)
  }

  function getQuerryString(
    trustedAlgorithmList: PublisherTrustedAlgorithm[],
    chainId?: number
  ): SearchQuery {
    const algorithmDidList = trustedAlgorithmList.map((x) => x.did)

    const baseParams = {
      chainIds: [chainId],
      sort: { sortBy: SortTermOptions.Created },
      filters: [
        getFilterTerm('service.attributes.main.type', 'algorithm'),
        getFilterTerm('id', algorithmDidList)
      ]
    } as BaseQueryParams

    const query = generateBaseQuery(baseParams)
    return query
  }

  async function getAlgorithmList(): Promise<AssetSelectionAsset[]> {
    const source = axios.CancelToken.source()
    const computeService = ddo.services[0]
    let algorithmSelectionList: AssetSelectionAsset[]
    if (
      !computeService.compute ||
      !computeService.compute.publisherTrustedAlgorithms ||
      computeService.compute.publisherTrustedAlgorithms.length === 0
    ) {
      algorithmSelectionList = []
    } else {
      const gueryResults = await queryMetadata(
        getQuerryString(
          computeService.compute.publisherTrustedAlgorithms,
          ddo.chainId
        ),
        source.token
      )
      setDdoAlgorithmList(gueryResults.results)

      algorithmSelectionList = await transformDDOToAssetSelection(
        computeService?.serviceEndpoint,
        gueryResults.results,
        [],
        newCancelToken()
      )
    }
    return algorithmSelectionList
  }

  const initMetadata = useCallback(async (ddo: Asset): Promise<void> => {
    if (!ddo) return
    const price = await getPrice(ddo)
    setAlgorithmPrice(price)
  }, [])

  useEffect(() => {
    if (!algorithmPrice) return

    setIsAlgoConsumablePrice(
      algorithmPrice.isConsumable !== undefined
        ? algorithmPrice.isConsumable === 'true'
        : true
    )
  }, [algorithmPrice])

  useEffect(() => {
    if (!price) return

    setIsConsumablePrice(
      price.isConsumable !== undefined ? price.isConsumable === 'true' : true
    )
  }, [price])

  // useEffect(() => {
  //   setDatasetTimeout(secondsToString(timeout))
  // }, [ddo])

  useEffect(() => {
    if (!ddo) return
    getAlgorithmList().then((algorithms) => {
      setAlgorithmList(algorithms)
    })
  }, [ddo])

  useEffect(() => {
    if (!accountId) return
    checkPreviousOrders(ddo)
  }, [ddo, accountId])

  useEffect(() => {
    if (!selectedAlgorithmAsset) return

    initMetadata(selectedAlgorithmAsset)

    const { timeout } = ddo.services[0]

    // setAlgorithmTimeout(secondsToString(timeout))

    if (accountId) {
      if (getServiceByName(selectedAlgorithmAsset, 'access')) {
        checkPreviousOrders(selectedAlgorithmAsset).then(() => {
          if (
            !hasPreviousAlgorithmOrder &&
            getServiceByName(selectedAlgorithmAsset, 'compute')
          ) {
            checkPreviousOrders(selectedAlgorithmAsset)
          }
        })
      } else if (getServiceByName(selectedAlgorithmAsset, 'compute')) {
        checkPreviousOrders(selectedAlgorithmAsset)
      }
    }
    checkAssetDTBalance(selectedAlgorithmAsset)
  }, [ddo, selectedAlgorithmAsset, accountId, hasPreviousAlgorithmOrder])

  // Output errors in toast UI
  useEffect(() => {
    const newError = error || pricingError
    if (!newError) return
    toast.error(newError)
  }, [error, pricingError])

  async function startJob(algorithmId: string) {
    try {
      setIsJobStarting(true)
      setIsPublished(false) // would be nice to rename this
      setError(undefined)

      const computeService = getServiceByName(ddo, 'compute')
      const serviceAlgo = getServiceByName(selectedAlgorithmAsset, 'access')
        ? getServiceByName(selectedAlgorithmAsset, 'access')
        : getServiceByName(selectedAlgorithmAsset, 'compute')

      const computeAlgorithm: ComputeAlgorithm = {
        documentId: selectedAlgorithmAsset.id,
        serviceId: serviceAlgo.id
        // dataToken: selectedAlgorithmAsset.services[0].datatokenAddress
      }

      const allowed = await isOrderable(
        ddo,
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

      if (!hasPreviousDatasetOrder && !hasDatatoken) {
        const tx = await buyDT('1', price, ddo)
        if (!tx) {
          setError('Error buying datatoken.')
          LoggerInstance.error(
            '[compute] Error buying datatoken for data set ',
            ddo.id
          )
          return
        }
      }

      if (!hasPreviousAlgorithmOrder && !hasAlgoAssetDatatoken) {
        const tx = await buyDT('1', algorithmPrice, selectedAlgorithmAsset)
        if (!tx) {
          setError('Error buying datatoken.')
          LoggerInstance.error(
            '[compute] Error buying datatoken for algorithm ',
            selectedAlgorithmAsset.id
          )
          return
        }
      }

      //     // TODO: pricingError is always undefined even upon errors during buyDT for whatever reason.
      //     // So manually drop out above, but ideally could be replaced with this alone.
      //     if (pricingError) {
      //       setError(pricingError)
      //       return
      //     }

      //     const assetOrderId = hasPreviousDatasetOrder
      //       ? previousDatasetOrderId
      //       : await ocean.compute.orderAsset(
      //           accountId,
      //           ddo.id,
      //           computeService.index,
      //           computeAlgorithm,
      //           appConfig.marketFeeAddress,
      //           undefined,
      //           null,
      //           false
      //         )

      //     assetOrderId &&
      //       LoggerInstance.log(
      //         `[compute] Got ${
      //           hasPreviousDatasetOrder ? 'existing' : 'new'
      //         } order ID for dataset: `,
      //         assetOrderId
      //       )

      //     const algorithmAssetOrderId = hasPreviousAlgorithmOrder
      //       ? previousAlgorithmOrderId
      //       : await ocean.compute.orderAlgorithm(
      //           algorithmId,
      //           serviceAlgo.type,
      //           accountId,
      //           serviceAlgo.index,
      //           appConfig.marketFeeAddress,
      //           undefined,
      //           null,
      //           false
      //         )

      //     algorithmAssetOrderId &&
      //       LoggerInstance.log(
      //         `[compute] Got ${
      //           hasPreviousAlgorithmOrder ? 'existing' : 'new'
      //         } order ID for algorithm: `,
      //         algorithmAssetOrderId
      //       )

      //     if (!assetOrderId || !algorithmAssetOrderId) {
      //       setError('Error ordering assets.')
      //       return
      //     }

      //     computeAlgorithm.transferTxId = algorithmAssetOrderId
      //     LoggerInstance.log('[compute] Starting compute job.')

      //     const output: ComputeOutput = {
      //       publishAlgorithmLog: true,
      //       publishOutput: true
      //     }
      //     const response = await ocean.compute.start(
      //       ddo.id,
      //       assetOrderId,
      //       ddo.services[0].datatokenAddress,
      //       account,
      //       computeAlgorithm,
      //       output,
      //       `${computeService.index}`,
      //       computeService.type
      //     )

      //     if (!response) {
      //       setError('Error starting compute job.')
      //       return
      //     }

      //     LoggerInstance.log('[compute] Starting compute job response: ', response)

      //     await checkPreviousOrders(selectedAlgorithmAsset)
      //     await checkPreviousOrders(ddo)
      //     setIsPublished(true)
    } catch (error) {
      await checkPreviousOrders(selectedAlgorithmAsset)
      await checkPreviousOrders(ddo)
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
        <Price price={price} conversion />
      </div>

      {ddo.metadata.type === 'algorithm' ? (
        <>
          <Alert
            text="This algorithm has been set to private by the publisher and can't be downloaded. You can run it against any allowed data sets though!"
            state="info"
          />
          <AlgorithmDatasetsListForCompute algorithmDid={ddo.id} ddo={ddo} />
        </>
      ) : (
        <Formik
          initialValues={getInitialValues()}
          validateOnMount
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            // await startJob(values.algorithm)
          }}
        >
          <FormStartComputeDataset
            algorithms={algorithmList}
            ddoListAlgorithms={ddoAlgorithmList}
            setSelectedAlgorithm={setSelectedAlgorithmAsset}
            isLoading={isJobStarting}
            isComputeButtonDisabled={isComputeButtonDisabled}
            hasPreviousOrder={hasPreviousDatasetOrder}
            hasDatatoken={hasDatatoken}
            dtBalance={dtBalance}
            datasetLowPoolLiquidity={!isConsumablePrice}
            assetType={ddo?.metadata.type}
            assetTimeout={datasetTimeout}
            hasPreviousOrderSelectedComputeAsset={hasPreviousAlgorithmOrder}
            hasDatatokenSelectedComputeAsset={hasAlgoAssetDatatoken}
            oceanSymbol={price ? price.oceanSymbol : ''}
            dtSymbolSelectedComputeAsset={
              selectedAlgorithmAsset?.datatokens[0]?.symbol
            }
            dtBalanceSelectedComputeAsset={algorithmDTBalance}
            selectedComputeAssetLowPoolLiquidity={!isAlgoConsumablePrice}
            selectedComputeAssetType="algorithm"
            selectedComputeAssetTimeout={algorithmTimeout}
            stepText={pricingStepText || 'Starting Compute Job...'}
            algorithmPrice={algorithmPrice}
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
      {accountId && price?.datatoken && (
        <AssetActionHistoryTable title="Your Compute Jobs">
          <ComputeJobs minimal />
        </AssetActionHistoryTable>
      )}
    </>
  )
}
