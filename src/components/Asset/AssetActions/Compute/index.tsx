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
  Service
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
  getQuerryString
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
import { getAccessDetails } from '@utils/accessDetailsAndPricing'
import { AccessDetails } from 'src/@types/Price'
import { transformAssetToAssetSelection } from '@utils/assetConvertor'

export default function Compute({
  asset,
  accessDetails,
  dtBalance,
  file,
  fileIsLoading,
  isConsumable,
  consumableFeedback
}: {
  asset: Asset
  accessDetails: AccessDetails
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
  const [selectedAlgorithmAsset, setSelectedAlgorithmAsset] = useState<Asset>()
  const [hasAlgoAssetDatatoken, setHasAlgoAssetDatatoken] = useState<boolean>()
  const [isPublished, setIsPublished] = useState(false)
  const [hasPreviousDatasetOrder, setHasPreviousDatasetOrder] = useState(false)
  const [previousDatasetOrderId, setPreviousDatasetOrderId] = useState<string>()
  const [hasPreviousAlgorithmOrder, setHasPreviousAlgorithmOrder] =
    useState(false)
  const [algorithmDTBalance, setAlgorithmDTBalance] = useState<string>()
  const [algorithmConsumeDetails, setAlgorithmConsumeDetails] =
    useState<AccessDetails>()
  const [previousAlgorithmOrderId, setPreviousAlgorithmOrderId] =
    useState<string>()
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
    (!hasPreviousDatasetOrder && !hasDatatoken && !isConsumablePrice) ||
    (!hasPreviousAlgorithmOrder &&
      !hasAlgoAssetDatatoken &&
      !isAlgoConsumablePrice)

  const { timeout } = asset?.services[0]

  async function checkPreviousOrders(asset: DDO) {
    const { type } = asset.metadata

    const orderId = await getPreviousOrders(
      asset.services[0].datatokenAddress?.toLowerCase(),
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

  async function getAlgorithmList(): Promise<AssetSelectionAsset[]> {
    const source = axios.CancelToken.source()
    const computeService = asset.services[0]
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
          asset.chainId
        ),
        source.token
      )
      setDdoAlgorithmList(gueryResults.results)

      algorithmSelectionList = await transformAssetToAssetSelection(
        computeService?.serviceEndpoint,
        gueryResults.results,
        []
      )
    }
    return algorithmSelectionList
  }

  const initMetadata = useCallback(async (asset: Asset): Promise<void> => {
    if (!asset) return
    const accessDetails = await getAccessDetails(
      asset.chainId,
      asset.services[0].datatokenAddress
    )
    setAlgorithmConsumeDetails(accessDetails)
  }, [])

  useEffect(() => {
    if (!algorithmConsumeDetails) return

    setIsAlgoConsumablePrice(algorithmConsumeDetails.isPurchasable)
  }, [algorithmConsumeDetails])

  useEffect(() => {
    if (!accessDetails) return

    setIsConsumablePrice(accessDetails.isPurchasable)
  }, [accessDetails])

  // useEffect(() => {
  //   setDatasetTimeout(secondsToString(timeout))
  // }, [ddo])

  useEffect(() => {
    if (!asset) return

    getAlgorithmsForAsset(asset, newCancelToken()).then((algorithmsAssets) => {
      console.log('getAlgorithmsForAsset', algorithmsAssets)
      setDdoAlgorithmList(algorithmsAssets)
      getAlgorithmAssetSelectionList(asset, algorithmsAssets).then(
        (algorithmSelectionList) => {
          setAlgorithmList(algorithmSelectionList)
        }
      )
    })
  }, [asset])

  useEffect(() => {
    if (!accountId) return
    checkPreviousOrders(asset)
  }, [asset, accountId])

  useEffect(() => {
    if (!selectedAlgorithmAsset) return

    initMetadata(selectedAlgorithmAsset)

    const { timeout } = asset.services[0]

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
  }, [asset, selectedAlgorithmAsset, accountId, hasPreviousAlgorithmOrder])

  // Output errors in toast UI
  useEffect(() => {
    const newError = error
    if (!newError) return
    toast.error(newError)
  }, [error])

  async function startJob(algorithmId: string): Promise<string> {
    try {
      //   setIsJobStarting(true)
      //   setIsPublished(false) // would be nice to rename this
      //   setError(undefined)
      //   const computeService = getServiceByName(asset, 'compute')
      //   const serviceAlgo = getServiceByName(selectedAlgorithmAsset, 'access')
      //     ? getServiceByName(selectedAlgorithmAsset, 'access')
      //     : getServiceByName(selectedAlgorithmAsset, 'compute')
      //   const computeAlgorithm: ComputeAlgorithm = {
      //     documentId: selectedAlgorithmAsset.id,
      //     serviceId: selectedAlgorithmAsset.services[0].id
      //   }
      //   const allowed = await isOrderable(
      //     asset,
      //     computeService.id,
      //     computeAlgorithm,
      //     selectedAlgorithmAsset
      //   )
      //   LoggerInstance.log('[compute] Is data set orderable?', allowed)
      //   if (!allowed) {
      //     setError(
      //       'Data set is not orderable in combination with selected algorithm.'
      //     )
      //     LoggerInstance.error(
      //       '[compute] Error starting compute job. Dataset is not orderable in combination with selected algorithm.'
      //     )
      //     return
      //   }
      //   let assetOrderId = hasPreviousDatasetOrder ? previousDatasetOrderId : ''
      //   if (!hasPreviousDatasetOrder) {
      //     // going to move/replace part of this logic when the use consume hook will be ready
      //     const initializeData = await ProviderInstance.initialize(
      //       asset.id,
      //       asset.services[0].id,
      //       0,
      //       accountId,
      //       asset.services[0].serviceEndpoint // to check
      //     )
      //     const providerFees: ProviderFees = {
      //       providerFeeAddress: initializeData.providerFee.providerFeeAddress,
      //       providerFeeToken: initializeData.providerFee.providerFeeToken,
      //       providerFeeAmount: initializeData.providerFee.providerFeeAmount,
      //       v: initializeData.providerFee.v,
      //       r: initializeData.providerFee.r,
      //       s: initializeData.providerFee.s,
      //       providerData: initializeData.providerFee.providerData,
      //       validUntil: initializeData.providerFee.validUntil
      //     }
      //     if (!hasDatatoken) {
      //       let tx: TransactionReceipt
      //       switch (accessDetails?.type) {
      //         case 'dynamic': {
      //           const oceanAmmount = new Decimal(accessDetails.price)
      //             .times(1.05)
      //             .toString()
      //           const maxPrice = new Decimal(accessDetails.price)
      //             .times(2)
      //             .toString()
      //           const poolInstance = new Pool(web3)
      //           if (
      //             new Decimal('1').greaterThan(
      //               await poolInstance.getReserve(
      //                 accessDetails.addressOrId,
      //                 accessDetails.datatoken.address
      //               )
      //             )
      //           ) {
      //             LoggerInstance.error(
      //               'ERROR: Buy quantity exceeds quantity allowed'
      //             )
      //           }
      //           const calcInGivenOut = await poolInstance.getAmountInExactOut(
      //             accessDetails.addressOrId,
      //             accessDetails.baseToken.address,
      //             accessDetails.datatoken.address,
      //             '1',
      //             '0.1'
      //           )
      //           if (new Decimal(calcInGivenOut).greaterThan(oceanAmmount)) {
      //             this.logger.error('ERROR: Not enough Ocean Tokens')
      //             return null
      //           }
      //           const approvetx = await approve(
      //             web3,
      //             accountId,
      //             accessDetails.baseToken.address,
      //             accountId,
      //             '1'
      //           )
      //           if (!approvetx) {
      //             LoggerInstance.error(
      //               'ERROR: Failed to call approve OCEAN token'
      //             )
      //           }
      //           const tokenInOutMarket: TokenInOutMarket = {
      //             tokenIn: accessDetails.baseToken.address,
      //             tokenOut: accessDetails.datatoken.address,
      //             marketFeeAddress: appConfig.marketFeeAddress
      //           }
      //           const amountsInOutMaxFee: AmountsOutMaxFee = {
      //             maxAmountIn: oceanAmmount,
      //             tokenAmountOut: '1',
      //             swapMarketFee: '0.1'
      //           }
      //           const tx = await poolInstance.swapExactAmountOut(
      //             accountId,
      //             accessDetails.addressOrId,
      //             tokenInOutMarket,
      //             amountsInOutMaxFee
      //           )
      //           break
      //         }
      //         case 'fixed': {
      //           const datatokenInstance = new Datatoken(web3)
      //           const order: OrderParams = {
      //             consumer: accountId,
      //             serviceIndex: 1,
      //             _providerFees: providerFees
      //           }
      //           const fre: FreOrderParams = {
      //             exchangeContract: accessDetails.addressOrId,
      //             exchangeId:
      //               '0x7ac824fef114255e5e3521a161ef692ec32003916fb6f3fe985cb74790d053ca',
      //             maxBaseTokenAmount: '1',
      //             swapMarketFee: web3.utils.toWei('0.1'),
      //             marketFeeAddress: appConfig.marketFeeAddress
      //           }
      //           tx = await datatokenInstance.buyFromFreAndOrder(
      //             asset.datatokens[0].address,
      //             accountId,
      //             order,
      //             fre
      //           )
      //           assetOrderId = tx.transactionHash
      //           break
      //         }
      //         case 'free': {
      //           const datatokenInstance = new Datatoken(web3)
      //           const order: OrderParams = {
      //             consumer: accountId,
      //             serviceIndex: 0,
      //             _providerFees: providerFees
      //           }
      //           const fre: FreOrderParams = {
      //             exchangeContract: accessDetails.addressOrId,
      //             exchangeId:
      //               '0x7ac824fef114255e5e3521a161ef692ec32003916fb6f3fe985cb74790d053ca',
      //             maxBaseTokenAmount: '1',
      //             swapMarketFee: web3.utils.toWei('0.1'),
      //             marketFeeAddress: appConfig.marketFeeAddress
      //           }
      //           tx = await datatokenInstance.buyFromDispenserAndOrder(
      //             asset.datatokens[0].address,
      //             accountId,
      //             order,
      //             accessDetails.addressOrId
      //           )
      //           assetOrderId = tx.transactionHash
      //           if (!tx) {
      //             setError('Error buying datatoken.')
      //             LoggerInstance.error(
      //               '[compute] Error buying datatoken for data set ',
      //               asset.id
      //             )
      //             return
      //           }
      //           break
      //         }
      //       }
      //     } else {
      //       const datatokenInstance = new Datatoken(web3)
      //       const tx = await datatokenInstance.startOrder(
      //         asset.datatokens[0].address,
      //         accountId,
      //         initializeData.computeAddress,
      //         0,
      //         providerFees
      //       )
      //       assetOrderId = tx.transactionHash
      //     }
      //   }
      //   let algorithmAssetOrderId = hasPreviousAlgorithmOrder
      //     ? previousAlgorithmOrderId
      //     : ''
      //   // add method for this logic
      //   if (!hasPreviousAlgorithmOrder) {
      //     // going to move replace part of this logic when the use consume hook will be ready
      //     const initializeData = await ProviderInstance.initialize(
      //       selectedAlgorithmAsset.id,
      //       selectedAlgorithmAsset.services[0].id,
      //       0,
      //       accountId,
      //       selectedAlgorithmAsset.services[0].serviceEndpoint // to check
      //     )
      //     const providerFees: ProviderFees = {
      //       providerFeeAddress: initializeData.providerFee.providerFeeAddress,
      //       providerFeeToken: initializeData.providerFee.providerFeeToken,
      //       providerFeeAmount: initializeData.providerFee.providerFeeAmount,
      //       v: initializeData.providerFee.v,
      //       r: initializeData.providerFee.r,
      //       s: initializeData.providerFee.s,
      //       providerData: initializeData.providerFee.providerData,
      //       validUntil: initializeData.providerFee.validUntil
      //     }
      //     if (!hasAlgoAssetDatatoken) {
      //       let tx: TransactionReceipt
      //       switch (algorithmConsumeDetails?.type) {
      //         case 'dynamic': {
      //           const oceanAmmount = new Decimal(algorithmConsumeDetails.price)
      //             .times(1.05)
      //             .toString()
      //           const maxPrice = new Decimal(algorithmConsumeDetails.price)
      //             .times(2)
      //             .toString()
      //           const poolInstance = new Pool(web3)
      //           if (
      //             new Decimal('1').greaterThan(
      //               await poolInstance.getReserve(
      //                 algorithmConsumeDetails.addressOrId,
      //                 algorithmConsumeDetails.datatoken.address
      //               )
      //             )
      //           ) {
      //             LoggerInstance.error(
      //               'ERROR: Buy quantity exceeds quantity allowed'
      //             )
      //           }
      //           const calcInGivenOut = await poolInstance.getAmountInExactOut(
      //             algorithmConsumeDetails.addressOrId,
      //             algorithmConsumeDetails.baseToken.address,
      //             algorithmConsumeDetails.datatoken.address,
      //             '1',
      //             '0.1'
      //           )
      //           if (new Decimal(calcInGivenOut).greaterThan(oceanAmmount)) {
      //             this.logger.error('ERROR: Not enough Ocean Tokens')
      //             return null
      //           }
      //           const approvetx = await approve(
      //             web3,
      //             accountId,
      //             algorithmConsumeDetails.baseToken.address,
      //             accountId,
      //             '1'
      //           )
      //           if (!approvetx) {
      //             LoggerInstance.error(
      //               'ERROR: Failed to call approve OCEAN token'
      //             )
      //           }
      //           const tokenInOutMarket: TokenInOutMarket = {
      //             tokenIn: algorithmConsumeDetails.baseToken.address,
      //             tokenOut: algorithmConsumeDetails.datatoken.address,
      //             marketFeeAddress: appConfig.marketFeeAddress
      //           }
      //           const amountsInOutMaxFee: AmountsOutMaxFee = {
      //             maxAmountIn: oceanAmmount,
      //             tokenAmountOut: '1',
      //             swapMarketFee: '0.1'
      //           }
      //           const tx = await poolInstance.swapExactAmountOut(
      //             accountId,
      //             algorithmConsumeDetails.addressOrId,
      //             tokenInOutMarket,
      //             amountsInOutMaxFee
      //           )
      //           break
      //         }
      //         case 'fixed': {
      //           const datatokenInstance = new Datatoken(web3)
      //           const order: OrderParams = {
      //             consumer: accountId,
      //             serviceIndex: 1,
      //             _providerFees: providerFees
      //           }
      //           const fre: FreOrderParams = {
      //             exchangeContract: algorithmConsumeDetails.addressOrId,
      //             exchangeId:
      //               '0x7ac824fef114255e5e3521a161ef692ec32003916fb6f3fe985cb74790d053ca',
      //             maxBaseTokenAmount: '1',
      //             swapMarketFee: web3.utils.toWei('0.1'), // to update
      //             marketFeeAddress: appConfig.marketFeeAddress
      //           }
      //           tx = await datatokenInstance.buyFromFreAndOrder(
      //             selectedAlgorithmAsset.datatokens[0].address,
      //             accountId,
      //             order,
      //             fre
      //           )
      //           algorithmAssetOrderId = tx.transactionHash
      //           break
      //         }
      //         case 'free': {
      //           const datatokenInstance = new Datatoken(web3)
      //           const order: OrderParams = {
      //             consumer: accountId,
      //             serviceIndex: 1,
      //             _providerFees: providerFees
      //           }
      //           const fre: FreOrderParams = {
      //             exchangeContract: algorithmConsumeDetails.addressOrId,
      //             exchangeId:
      //               '0x7ac824fef114255e5e3521a161ef692ec32003916fb6f3fe985cb74790d053ca',
      //             maxBaseTokenAmount: '1',
      //             swapMarketFee: web3.utils.toWei('0.1'), // to update
      //             marketFeeAddress: appConfig.marketFeeAddress
      //           }
      //           tx = await datatokenInstance.buyFromDispenserAndOrder(
      //             selectedAlgorithmAsset.datatokens[0].address,
      //             accountId,
      //             order,
      //             algorithmConsumeDetails.addressOrId
      //           )
      //           algorithmAssetOrderId = tx.transactionHash
      //           break
      //         }
      //       }
      //     } else {
      //       const datatokenInstance = new Datatoken(web3)
      //       const tx = await datatokenInstance.startOrder(
      //         selectedAlgorithmAsset.datatokens[0].address,
      //         accountId,
      //         initializeData.computeAddress,
      //         0,
      //         providerFees
      //       )
      //       algorithmAssetOrderId = tx.transactionHash
      //     }
      //   }
      //   LoggerInstance.log(
      //     `[compute] Got ${
      //       hasPreviousDatasetOrder ? 'existing' : 'new'
      //     } order ID for dataset: `,
      //     assetOrderId
      //   )
      //   LoggerInstance.log(
      //     `[compute] Got ${
      //       hasPreviousAlgorithmOrder ? 'existing' : 'new'
      //     } order ID for algorithm: `,
      //     algorithmAssetOrderId
      //   )
      //   if (!assetOrderId || !algorithmAssetOrderId) {
      //     setError('Error ordering assets.')
      //     return
      //   }
      //   computeAlgorithm.transferTxId = algorithmAssetOrderId
      //   LoggerInstance.log('[compute] Starting compute job.')
      //   const computeAsset: ComputeAsset = {
      //     documentId: asset.id,
      //     serviceId: asset.services[0].id,
      //     transferTxId: assetOrderId
      //   }
      //   computeAlgorithm.transferTxId = algorithmAssetOrderId
      //   const output: ComputeOutput = {
      //     publishAlgorithmLog: true,
      //     publishOutput: true
      //   }
      //   const response = await ProviderInstance.computeStart(
      //     asset.services[0].serviceEndpoint,
      //     web3,
      //     accountId,
      //     'env1',
      //     computeAsset,
      //     computeAlgorithm,
      //     newAbortController(),
      //     null,
      //     output
      //   )
      //   if (!response) {
      //     setError('Error starting compute job.')
      //     return
      //   }
      //   LoggerInstance.log('[compute] Starting compute job response: ', response)
      //   await checkPreviousOrders(selectedAlgorithmAsset)
      //   await checkPreviousOrders(asset)
      //   setIsPublished(true)
      return 'dummy'
    } catch (error) {
      await checkPreviousOrders(selectedAlgorithmAsset)
      await checkPreviousOrders(asset)
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
        <Price accessDetails={accessDetails} conversion />
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
            setSelectedAlgorithm={setSelectedAlgorithmAsset}
            isLoading={isJobStarting}
            isComputeButtonDisabled={isComputeButtonDisabled}
            hasPreviousOrder={hasPreviousDatasetOrder}
            hasDatatoken={hasDatatoken}
            dtBalance={dtBalance}
            datasetLowPoolLiquidity={!isConsumablePrice}
            assetType={asset?.metadata.type}
            assetTimeout={datasetTimeout}
            hasPreviousOrderSelectedComputeAsset={hasPreviousAlgorithmOrder}
            hasDatatokenSelectedComputeAsset={hasAlgoAssetDatatoken}
            oceanSymbol={accessDetails ? accessDetails.baseToken.symbol : ''}
            dtSymbolSelectedComputeAsset={
              selectedAlgorithmAsset?.datatokens[0]?.symbol
            }
            dtBalanceSelectedComputeAsset={algorithmDTBalance}
            selectedComputeAssetLowPoolLiquidity={!isAlgoConsumablePrice}
            selectedComputeAssetType="algorithm"
            selectedComputeAssetTimeout={algorithmTimeout}
            // lazy comment when removing pricingStepText
            stepText={'pricingStepText' || 'Starting Compute Job...'}
            algorithmConsumeDetails={algorithmConsumeDetails}
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
      {accountId && accessDetails?.datatoken && (
        <AssetActionHistoryTable title="Your Compute Jobs">
          <ComputeJobs minimal />
        </AssetActionHistoryTable>
      )}
    </>
  )
}
