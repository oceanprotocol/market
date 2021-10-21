import React, { useState, ReactElement, useEffect, useCallback } from 'react'
import {
  DDO,
  File as FileMetadata,
  Logger,
  publisherTrustedAlgorithm
} from '@oceanprotocol/lib'
import { toast } from 'react-toastify'
import Price from '@shared/Price'
import FileIcon from '@shared/FileIcon'
import Alert from '@shared/atoms/Alert'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import { useOcean } from '@context/Ocean'
import { useWeb3 } from '@context/Web3'
import { usePricing } from '@hooks/usePricing'
import { useAsset } from '@context/Asset'
import {
  generateBaseQuery,
  getFilterTerm,
  queryMetadata,
  transformDDOToAssetSelection
} from '@utils/aquarius'
import { Formik } from 'formik'
import { getInitialValues, validationSchema } from './_constants'
import {
  ComputeAlgorithm,
  ComputeOutput
} from '@oceanprotocol/lib/dist/node/ocean/interfaces/Compute'
import axios from 'axios'
import FormStartComputeDataset from './FormComputeDataset'
import styles from './index.module.css'
import SuccessConfetti from '@shared/SuccessConfetti'
import { secondsToString } from '@utils/metadata'
import { AssetSelectionAsset } from '@shared/Form/FormFields/AssetSelection'
import AlgorithmDatasetsListForCompute from '../../AssetContent/AlgorithmDatasetsListForCompute'
import { getPreviousOrders, getPrice } from '@utils/subgraph'
import AssetActionHistoryTable from '../AssetActionHistoryTable'
import ComputeJobs from '../../../Profile/History/ComputeJobs'
import { useCancelToken } from '@hooks/useCancelToken'
import { useIsMounted } from '@hooks/useIsMounted'
import { SortTermOptions } from '../../../../@types/aquarius/SearchQuery'

export default function Compute({
  dtBalance,
  file,
  fileIsLoading,
  isConsumable,
  consumableFeedback
}: {
  dtBalance: string
  file: FileMetadata
  fileIsLoading?: boolean
  isConsumable?: boolean
  consumableFeedback?: string
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { accountId } = useWeb3()
  const { ocean, account } = useOcean()
  const { price, type, ddo } = useAsset()
  const { buyDT, pricingError, pricingStepText } = usePricing()
  const [isJobStarting, setIsJobStarting] = useState(false)
  const [error, setError] = useState<string>()

  const [algorithmList, setAlgorithmList] = useState<AssetSelectionAsset[]>()
  const [ddoAlgorithmList, setDdoAlgorithmList] = useState<DDO[]>()
  const [selectedAlgorithmAsset, setSelectedAlgorithmAsset] = useState<DDO>()
  const [hasAlgoAssetDatatoken, setHasAlgoAssetDatatoken] = useState<boolean>()
  const [isPublished, setIsPublished] = useState(false)
  const [hasPreviousDatasetOrder, setHasPreviousDatasetOrder] = useState(false)
  const [previousDatasetOrderId, setPreviousDatasetOrderId] = useState<string>()
  const [hasPreviousAlgorithmOrder, setHasPreviousAlgorithmOrder] =
    useState(false)
  const [algorithmDTBalance, setalgorithmDTBalance] = useState<string>()
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
    !ocean ||
    (!hasPreviousDatasetOrder && !hasDatatoken && !isConsumablePrice) ||
    (!hasPreviousAlgorithmOrder &&
      !hasAlgoAssetDatatoken &&
      !isAlgoConsumablePrice)

  async function checkPreviousOrders(ddo: DDO) {
    const { timeout } = (
      ddo.findServiceByType('access') || ddo.findServiceByType('compute')
    ).attributes.main
    const orderId = await getPreviousOrders(
      ddo.dataToken?.toLowerCase(),
      accountId?.toLowerCase(),
      timeout.toString()
    )
    const assetType = ddo.findServiceByType('metadata').attributes.main.type

    if (!isMounted()) return
    if (assetType === 'algorithm') {
      setPreviousAlgorithmOrderId(orderId)
      setHasPreviousAlgorithmOrder(!!orderId)
    } else {
      setPreviousDatasetOrderId(orderId)
      setHasPreviousDatasetOrder(!!orderId)
    }
  }

  async function checkAssetDTBalance(asset: DDO) {
    const AssetDtBalance = await ocean.datatokens.balance(
      asset.dataToken,
      accountId
    )
    setalgorithmDTBalance(AssetDtBalance)
    setHasAlgoAssetDatatoken(Number(AssetDtBalance) >= 1)
  }

  function getQuerryString(
    trustedAlgorithmList: publisherTrustedAlgorithm[],
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
    const computeService = ddo.findServiceByType('compute')
    let algorithmSelectionList: AssetSelectionAsset[]
    if (
      !computeService.attributes.main.privacy ||
      !computeService.attributes.main.privacy.publisherTrustedAlgorithms ||
      (computeService.attributes.main.privacy.publisherTrustedAlgorithms
        .length === 0 &&
        !computeService.attributes.main.privacy.allowAllPublishedAlgorithms)
    ) {
      algorithmSelectionList = []
    } else {
      const gueryResults = await queryMetadata(
        getQuerryString(
          computeService.attributes.main.privacy.publisherTrustedAlgorithms,
          ddo.chainId
        ),
        source.token
      )
      setDdoAlgorithmList(gueryResults.results)
      const datasetComputeService = ddo.findServiceByType('compute')
      algorithmSelectionList = await transformDDOToAssetSelection(
        datasetComputeService?.serviceEndpoint,
        gueryResults.results,
        [],
        newCancelToken()
      )
    }
    return algorithmSelectionList
  }

  const initMetadata = useCallback(async (ddo: DDO): Promise<void> => {
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

  useEffect(() => {
    const { timeout } = (
      ddo.findServiceByType('access') || ddo.findServiceByType('compute')
    ).attributes.main
    setDatasetTimeout(secondsToString(timeout))
  }, [ddo])

  useEffect(() => {
    if (!ddo) return
    getAlgorithmList().then((algorithms) => {
      setAlgorithmList(algorithms)
    })
  }, [ddo])

  useEffect(() => {
    if (!ocean || !accountId) return
    checkPreviousOrders(ddo)
  }, [ocean, ddo, accountId])

  useEffect(() => {
    if (!selectedAlgorithmAsset) return

    initMetadata(selectedAlgorithmAsset)

    const { timeout } = (
      ddo.findServiceByType('access') || ddo.findServiceByType('compute')
    ).attributes.main
    setAlgorithmTimeout(secondsToString(timeout))

    if (accountId) {
      if (selectedAlgorithmAsset.findServiceByType('access')) {
        checkPreviousOrders(selectedAlgorithmAsset).then(() => {
          if (
            !hasPreviousAlgorithmOrder &&
            selectedAlgorithmAsset.findServiceByType('compute')
          ) {
            checkPreviousOrders(selectedAlgorithmAsset)
          }
        })
      } else if (selectedAlgorithmAsset.findServiceByType('compute')) {
        checkPreviousOrders(selectedAlgorithmAsset)
      }
    }
    ocean && checkAssetDTBalance(selectedAlgorithmAsset)
  }, [selectedAlgorithmAsset, ocean, accountId, hasPreviousAlgorithmOrder])

  // Output errors in toast UI
  useEffect(() => {
    const newError = error || pricingError
    if (!newError) return
    toast.error(newError)
  }, [error, pricingError])

  async function startJob(algorithmId: string) {
    try {
      if (!ocean) return

      setIsJobStarting(true)
      setIsPublished(false)
      setError(undefined)

      const computeService = ddo.findServiceByType('compute')
      const serviceAlgo = selectedAlgorithmAsset.findServiceByType('access')
        ? selectedAlgorithmAsset.findServiceByType('access')
        : selectedAlgorithmAsset.findServiceByType('compute')

      const computeAlgorithm: ComputeAlgorithm = {
        did: selectedAlgorithmAsset.id,
        serviceIndex: serviceAlgo.index,
        dataToken: selectedAlgorithmAsset.dataToken
      }
      const allowed = await ocean.compute.isOrderable(
        ddo.id,
        computeService.index,
        computeAlgorithm
      )
      Logger.log('[compute] Is data set orderable?', allowed)

      if (!allowed) {
        setError(
          'Data set is not orderable in combination with selected algorithm.'
        )
        Logger.error(
          '[compute] Error starting compute job. Dataset is not orderable in combination with selected algorithm.'
        )
        return
      }

      if (!hasPreviousDatasetOrder && !hasDatatoken) {
        const tx = await buyDT('1', price, ddo)
        if (!tx) {
          setError('Error buying datatoken.')
          Logger.error('[compute] Error buying datatoken for data set ', ddo.id)
          return
        }
      }

      if (!hasPreviousAlgorithmOrder && !hasAlgoAssetDatatoken) {
        const tx = await buyDT('1', algorithmPrice, selectedAlgorithmAsset)
        if (!tx) {
          setError('Error buying datatoken.')
          Logger.error(
            '[compute] Error buying datatoken for algorithm ',
            selectedAlgorithmAsset.id
          )
          return
        }
      }

      // TODO: pricingError is always undefined even upon errors during buyDT for whatever reason.
      // So manually drop out above, but ideally could be replaced with this alone.
      if (pricingError) {
        setError(pricingError)
        return
      }

      const assetOrderId = hasPreviousDatasetOrder
        ? previousDatasetOrderId
        : await ocean.compute.orderAsset(
            accountId,
            ddo.id,
            computeService.index,
            computeAlgorithm,
            appConfig.marketFeeAddress,
            undefined,
            null,
            false
          )

      assetOrderId &&
        Logger.log(
          `[compute] Got ${
            hasPreviousDatasetOrder ? 'existing' : 'new'
          } order ID for dataset: `,
          assetOrderId
        )

      const algorithmAssetOrderId = hasPreviousAlgorithmOrder
        ? previousAlgorithmOrderId
        : await ocean.compute.orderAlgorithm(
            algorithmId,
            serviceAlgo.type,
            accountId,
            serviceAlgo.index,
            appConfig.marketFeeAddress,
            undefined,
            null,
            false
          )

      algorithmAssetOrderId &&
        Logger.log(
          `[compute] Got ${
            hasPreviousAlgorithmOrder ? 'existing' : 'new'
          } order ID for algorithm: `,
          algorithmAssetOrderId
        )

      if (!assetOrderId || !algorithmAssetOrderId) {
        setError('Error ordering assets.')
        return
      }

      computeAlgorithm.transferTxId = algorithmAssetOrderId
      Logger.log('[compute] Starting compute job.')

      const output: ComputeOutput = {
        publishAlgorithmLog: true,
        publishOutput: true
      }
      const response = await ocean.compute.start(
        ddo.id,
        assetOrderId,
        ddo.dataToken,
        account,
        computeAlgorithm,
        output,
        `${computeService.index}`,
        computeService.type
      )

      if (!response) {
        setError('Error starting compute job.')
        return
      }

      Logger.log('[compute] Starting compute job response: ', response)

      await checkPreviousOrders(selectedAlgorithmAsset)
      await checkPreviousOrders(ddo)
      setIsPublished(true)
    } catch (error) {
      await checkPreviousOrders(selectedAlgorithmAsset)
      await checkPreviousOrders(ddo)
      setError('Failed to start job!')
      Logger.error('[compute] Failed to start job: ', error.message)
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

      {type === 'algorithm' ? (
        <>
          <Alert
            text="This algorithm has been set to private by the publisher and can't be downloaded. You can run it against any allowed data sets though!"
            state="info"
          />
          <AlgorithmDatasetsListForCompute
            algorithmDid={ddo.id}
            dataset={ddo}
          />
        </>
      ) : (
        <Formik
          initialValues={getInitialValues()}
          validateOnMount
          validationSchema={validationSchema}
          onSubmit={async (values) => await startJob(values.algorithm)}
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
            assetType={type}
            assetTimeout={datasetTimeout}
            hasPreviousOrderSelectedComputeAsset={hasPreviousAlgorithmOrder}
            hasDatatokenSelectedComputeAsset={hasAlgoAssetDatatoken}
            oceanSymbol={price ? price.oceanSymbol : ''}
            dtSymbolSelectedComputeAsset={
              selectedAlgorithmAsset?.dataTokenInfo?.symbol
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
      {accountId && (
        <AssetActionHistoryTable title="Your Compute Jobs">
          <ComputeJobs minimal />
        </AssetActionHistoryTable>
      )}
    </>
  )
}
