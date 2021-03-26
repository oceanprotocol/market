import React, { useState, ReactElement, useEffect } from 'react'
import {
  DDO,
  File as FileMetadata,
  Logger,
  ServiceType,
  publisherTrustedAlgorithm
} from '@oceanprotocol/lib'
import { toast } from 'react-toastify'
import Price from '../../../atoms/Price'
import File from '../../../atoms/File'
import Input from '../../../atoms/Input'
import Alert from '../../../atoms/Alert'
import Web3Feedback from '../../../molecules/Wallet/Feedback'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'
import checkPreviousOrder from '../../../../utils/checkPreviousOrder'
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
import { AssetSelectionAsset } from '../../../molecules/FormFields/AssetSelection'
import { SearchQuery } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import axios from 'axios'
import FormStartComputeDataset from './FormComputeDataset'
import styles from './index.module.css'

export default function Compute({
  ddo,
  isBalanceSufficient,
  dtBalance,
  file
}: {
  ddo: DDO
  isBalanceSufficient: boolean
  dtBalance: string
  file: FileMetadata
}): ReactElement {
  const { marketFeeAddress } = useSiteMetadata()
  const { accountId } = useWeb3()
  const { ocean, account, config } = useOcean()
  const { type } = useAsset()
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
  const [
    previousAlgorithmOrderId,
    setPreviousAlgorithmOrderId
  ] = useState<string>()

  const isComputeButtonDisabled =
    isJobStarting === true || file === null || !ocean || !isBalanceSufficient
  const hasDatatoken = Number(dtBalance) >= 1

  async function checkPreviousOrders(ddo: DDO, serviceType: ServiceType) {
    const orderId = await checkPreviousOrder(ocean, accountId, ddo, serviceType)
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
    setHasAlgoAssetDatatoken(Number(AssetDtBalance) >= 1)
  }

  function getQuerryString(
    trustedAlgorithmList: publisherTrustedAlgorithm[]
  ): SearchQuery {
    let algoQuerry = ''
    trustedAlgorithmList.forEach((trusteAlgo) => {
      algoQuerry += `id:"${trusteAlgo.did}" OR `
    })
    if (trustedAlgorithmList.length > 1) {
      algoQuerry = algoQuerry.substring(0, algoQuerry.length - 3)
    }
    const algorithmQuery =
      trustedAlgorithmList.length > 0 ? `(${algoQuerry}) AND` : ``
    const query = {
      page: 1,
      query: {
        query_string: {
          query: `${algorithmQuery} service.attributes.main.type:algorithm AND price.type:exchange -isInPurgatory:true`
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
      computeService.attributes.main.privacy.publisherTrustedAlgorithms
        .length === 0 &&
      !computeService.attributes.main.privacy.allowAllPublishedAlgorithms
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
    if (!ddo) return
    getAlgorithmList().then((algorithms) => {
      setAlgorithmList(algorithms)
    })
  }, [ddo])

  useEffect(() => {
    if (!ocean || !accountId) return
    checkPreviousOrders(ddo, 'compute')
  }, [ocean, ddo, accountId])

  useEffect(() => {
    if (!ocean || !accountId || !selectedAlgorithmAsset) return
    checkPreviousOrders(selectedAlgorithmAsset, 'access')
    checkAssetDTBalance(selectedAlgorithmAsset)
  }, [selectedAlgorithmAsset, ocean, accountId])

  // Output errors in toast UI
  useEffect(() => {
    if (!error || !pricingError) return
    toast.error(error || pricingError)
  }, [error, pricingError])

  async function startJob(algorithmId: string) {
    try {
      if (!ocean) return

      setIsJobStarting(true)
      setIsPublished(false)
      setError(undefined)

      const computeService = ddo.findServiceByType('compute')
      const serviceAlgo = selectedAlgorithmAsset.findServiceByType('access')

      const allowed = await ocean.compute.isOrderable(
        ddo.id,
        computeService.index
      )
      Logger.log('[compute] Is dataset orderable?', allowed)

      if (!hasPreviousDatasetOrder && !hasDatatoken) {
        const tx = await buyDT('1', (ddo as DDO).price, ddo)
        if (!tx) {
          setError('Error buying datatoken.')
          return
        }
      }

      if (!hasPreviousAlgorithmOrder && !hasAlgoAssetDatatoken) {
        const tx = await buyDT(
          '1',
          (selectedAlgorithmAsset as DDO).price,
          selectedAlgorithmAsset
        )
        if (!tx) {
          setError('Error buying datatoken.')
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
            computeService.index
          )

      const algorithmAssetOrderId = hasPreviousAlgorithmOrder
        ? previousAlgorithmOrderId
        : await ocean.compute.orderAlgorithm(
            algorithmId,
            serviceAlgo.type,
            accountId,
            serviceAlgo.index
          )

      if (!assetOrderId || !algorithmAssetOrderId) {
        setError('Error ordering assets.')
        return
      }

      const output = {}
      const respone = await ocean.compute.start(
        ddo.id,
        assetOrderId,
        ddo.dataToken,
        account,
        algorithmId,
        undefined,
        output,
        `${computeService.index}`,
        computeService.type,
        algorithmAssetOrderId,
        selectedAlgorithmAsset.dataToken
      )
      Logger.log('[compute] Start compute response: ', respone)

      setHasPreviousDatasetOrder(true)
      setIsPublished(true)
    } catch (error) {
      setError('Failed to start job!')
      Logger.error(`[compute] ${error.message}`)
    } finally {
      setIsJobStarting(false)
    }
  }

  return (
    <>
      <div className={styles.info}>
        <File file={file} small />
        <Price price={(ddo as DDO).price} conversion />
      </div>

      {type === 'algorithm' ? (
        <Input
          type="select"
          name="data"
          label="Select dataset for the algorithm"
          placeholder=""
          size="small"
          value="dataset-1"
          options={['dataset-1', 'dataset-2', 'dataset-3'].map((x) => x)}
          // onChange={handleSelectChange}
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
            hasPreviousOrder={
              hasPreviousDatasetOrder || hasPreviousAlgorithmOrder
            }
            hasDatatoken={hasDatatoken}
            dtSymbol={ddo.dataTokenInfo?.symbol}
            dtBalance={dtBalance}
            stepText={pricingStepText || 'Starting Compute Job...'}
          />
        </Formik>
      )}

      <footer className={styles.feedback}>
        {isPublished && (
          <Alert
            title="Your job started!"
            text="Watch the progress in the history page."
            state="success"
          />
        )}
        <Web3Feedback isBalanceSufficient={isBalanceSufficient} />
      </footer>
    </>
  )
}
