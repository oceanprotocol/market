import React, { useState, ReactElement, useEffect, useCallback } from 'react'
import {
  DDO,
  File as FileMetadata,
  Logger,
  ServiceType,
  publisherTrustedAlgorithm,
  BestPrice
} from '@oceanprotocol/lib'
import { toast } from 'react-toastify'
import Price from '../../../atoms/Price'
import File from '../../../atoms/File'
import Alert from '../../../atoms/Alert'
import Web3Feedback from '../../../molecules/Wallet/Feedback'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'
import { useOcean } from '../../../../providers/Ocean'
import { useWeb3 } from '../../../../providers/Web3'
import { usePricing } from '../../../../hooks/usePricing'
import { useAsset } from '../../../../providers/Asset'
import {
  queryMetadata,
  transformDDOToAssetSelection
} from '../../../../utils/aquarius'
import { Formik } from 'formik'
import {
  getInitialValues,
  validationSchema
} from '../../../../models/FormStartComputeDataset'
import {
  ComputeAlgorithm,
  ComputeOutput
} from '@oceanprotocol/lib/dist/node/ocean/interfaces/Compute'
import { AssetSelectionAsset } from '../../../molecules/FormFields/AssetSelection'
import { SearchQuery } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import axios from 'axios'
import FormStartComputeDataset from './FormComputeDataset'
import styles from './index.module.css'
import SuccessConfetti from '../../../atoms/SuccessConfetti'
import Button from '../../../atoms/Button'
import { gql, useQuery } from '@apollo/client'
import { FrePrice } from '../../../../@types/apollo/FrePrice'
import { PoolPrice } from '../../../../@types/apollo/PoolPrice'
import { secondsToString } from '../../../../utils/metadata'
import { getPreviousOrders } from '../../../../utils/subgraph'

const SuccessAction = () => (
  <Button style="text" to="/history" size="small">
    Go to history →
  </Button>
)

const freQuery = gql`
  query AlgorithmFrePrice($datatoken: String) {
    fixedRateExchanges(orderBy: id, where: { datatoken: $datatoken }) {
      rate
      id
    }
  }
`
const poolQuery = gql`
  query AlgorithmPoolPrice($datatoken: String) {
    pools(where: { datatokenAddress: $datatoken }) {
      spotPrice
      consumePrice
    }
  }
`

export default function Compute({
  isBalanceSufficient,
  dtBalance,
  file
}: {
  isBalanceSufficient: boolean
  dtBalance: string
  file: FileMetadata
}): ReactElement {
  const { marketFeeAddress } = useSiteMetadata()
  const { accountId } = useWeb3()
  const { ocean, account, config } = useOcean()
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
  const [hasPreviousAlgorithmOrder, setHasPreviousAlgorithmOrder] = useState(
    false
  )
  const [algorithmDTBalance, setalgorithmDTBalance] = useState<string>()
  const [algorithmPrice, setAlgorithmPrice] = useState<BestPrice>()
  const [variables, setVariables] = useState({})
  const [
    previousAlgorithmOrderId,
    setPreviousAlgorithmOrderId
  ] = useState<string>()
  const [datasetTimeout, setDatasetTimeout] = useState<string>()
  const [algorithmTimeout, setAlgorithmTimeout] = useState<string>()

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {
    refetch: refetchFre,
    startPolling: startPollingFre,
    data: frePrice
  } = useQuery<FrePrice>(freQuery, {
    variables,
    skip: false
  })
  const {
    refetch: refetchPool,
    startPolling: startPollingPool,
    data: poolPrice
  } = useQuery<PoolPrice>(poolQuery, {
    variables,
    skip: false
  })
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const isComputeButtonDisabled =
    isJobStarting === true || file === null || !ocean || !isBalanceSufficient
  const hasDatatoken = Number(dtBalance) >= 1

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
    trustedAlgorithmList: publisherTrustedAlgorithm[]
  ): SearchQuery {
    let algoQuerry = ''
    trustedAlgorithmList.forEach((trusteAlgo) => {
      algoQuerry += `id:"${trusteAlgo.did}" OR `
    })
    if (trustedAlgorithmList.length >= 1) {
      algoQuerry = algoQuerry.substring(0, algoQuerry.length - 3)
    }
    const algorithmQuery =
      trustedAlgorithmList.length > 0 ? `(${algoQuerry}) AND` : ``
    const query = {
      page: 1,
      query: {
        query_string: {
          query: `${algorithmQuery} service.attributes.main.type:algorithm -isInPurgatory:true`
        }
      },
      sort: { created: -1 }
    }
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
          computeService.attributes.main.privacy.publisherTrustedAlgorithms
        ),
        config.metadataCacheUri,
        source.token
      )
      setDdoAlgorithmList(gueryResults.results)
      algorithmSelectionList = await transformDDOToAssetSelection(
        gueryResults.results,
        config.metadataCacheUri,
        []
      )
    }
    return algorithmSelectionList
  }

  useEffect(() => {
    const { timeout } = (
      ddo.findServiceByType('access') || ddo.findServiceByType('compute')
    ).attributes.main
    setDatasetTimeout(secondsToString(timeout))
  }, [ddo])

  useEffect(() => {
    if (
      !frePrice ||
      frePrice.fixedRateExchanges.length === 0 ||
      algorithmPrice.type !== 'exchange'
    )
      return
    setAlgorithmPrice((prevState) => ({
      ...prevState,
      value: frePrice.fixedRateExchanges[0].rate,
      address: frePrice.fixedRateExchanges[0].id
    }))
  }, [frePrice])

  useEffect(() => {
    if (
      !poolPrice ||
      poolPrice.pools.length === 0 ||
      algorithmPrice.type !== 'pool'
    )
      return
    setAlgorithmPrice((prevState) => ({
      ...prevState,
      value:
        poolPrice.pools[0].consumePrice === '-1'
          ? poolPrice.pools[0].spotPrice
          : poolPrice.pools[0].consumePrice
    }))
  }, [poolPrice])

  const initMetadata = useCallback(async (ddo: DDO): Promise<void> => {
    if (!ddo) return
    setAlgorithmPrice(ddo.price)
    setVariables({ datatoken: ddo?.dataToken.toLowerCase() })
  }, [])

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
            marketFeeAddress,
            undefined,
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
            marketFeeAddress,
            undefined,
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

      setHasPreviousDatasetOrder(true)
      setIsPublished(true)
    } catch (error) {
      setError('Failed to start job!')
      Logger.error('[compute] Failed to start job: ', error.message)
    } finally {
      setIsJobStarting(false)
    }
  }

  return (
    <>
      <div className={styles.info}>
        <File file={file} small />
        <Price price={price} conversion />
      </div>

      {type === 'algorithm' ? (
        <Alert
          text="This algorithm has been set to private by the publisher and can't be downloaded. You can run it against any allowed data sets though!"
          state="info"
        />
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
            assetType={type}
            assetTimeout={datasetTimeout}
            hasPreviousOrderSelectedComputeAsset={hasPreviousAlgorithmOrder}
            hasDatatokenSelectedComputeAsset={hasAlgoAssetDatatoken}
            dtSymbolSelectedComputeAsset={
              selectedAlgorithmAsset?.dataTokenInfo?.symbol
            }
            dtBalanceSelectedComputeAsset={algorithmDTBalance}
            selectedComputeAssetType="algorithm"
            selectedComputeAssetTimeout={algorithmTimeout}
            stepText={pricingStepText || 'Starting Compute Job...'}
            algorithmPrice={algorithmPrice}
          />
        </Formik>
      )}

      <footer className={styles.feedback}>
        {isPublished && (
          <SuccessConfetti
            success="Your job started successfully! Watch the progress on the history page."
            action={<SuccessAction />}
          />
        )}
        {type !== 'algorithm' && (
          <Web3Feedback isBalanceSufficient={isBalanceSufficient} />
        )}
      </footer>
    </>
  )
}
