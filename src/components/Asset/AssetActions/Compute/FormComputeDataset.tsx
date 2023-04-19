import React, { ReactElement, useEffect, useState } from 'react'
import styles from './FormComputeDataset.module.css'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Input from '@shared/FormInput'
import { AssetSelectionAsset } from '@shared/FormInput/InputElement/AssetSelection'
import { compareAsBN } from '@utils/numbers'
import ButtonBuy from '../ButtonBuy'
import PriceOutput from './PriceOutput'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import content from '../../../../../content/pages/startComputeDataset.json'
import { Asset, ZERO_ADDRESS } from '@oceanprotocol/lib'
import { getAccessDetails } from '@utils/accessDetailsAndPricing'
import { useMarketMetadata } from '@context/MarketMetadata'
import Alert from '@shared/atoms/Alert'
import { getTokenBalanceFromSymbol } from '@utils/web3'
import { MAX_DECIMALS } from '@utils/constants'
import Decimal from 'decimal.js'

export default function FormStartCompute({
  algorithms,
  ddoListAlgorithms,
  selectedAlgorithmAsset,
  setSelectedAlgorithm,
  isLoading,
  isComputeButtonDisabled,
  hasPreviousOrder,
  hasDatatoken,
  dtBalance,
  assetType,
  assetTimeout,
  hasPreviousOrderSelectedComputeAsset,
  hasDatatokenSelectedComputeAsset,
  datasetSymbol,
  algorithmSymbol,
  providerFeesSymbol,
  dtSymbolSelectedComputeAsset,
  dtBalanceSelectedComputeAsset,
  selectedComputeAssetType,
  selectedComputeAssetTimeout,
  stepText,
  isConsumable,
  consumableFeedback,
  datasetOrderPriceAndFees,
  algoOrderPriceAndFees,
  providerFeeAmount,
  validUntil,
  retry
}: {
  algorithms: AssetSelectionAsset[]
  ddoListAlgorithms: Asset[]
  selectedAlgorithmAsset: AssetExtended
  setSelectedAlgorithm: React.Dispatch<React.SetStateAction<AssetExtended>>
  isLoading: boolean
  isComputeButtonDisabled: boolean
  hasPreviousOrder: boolean
  hasDatatoken: boolean
  dtBalance: string
  assetType: string
  assetTimeout: string
  hasPreviousOrderSelectedComputeAsset?: boolean
  hasDatatokenSelectedComputeAsset?: boolean
  datasetSymbol?: string
  algorithmSymbol?: string
  providerFeesSymbol?: string
  dtSymbolSelectedComputeAsset?: string
  dtBalanceSelectedComputeAsset?: string
  selectedComputeAssetType?: string
  selectedComputeAssetTimeout?: string
  stepText: string
  isConsumable: boolean
  consumableFeedback: string
  datasetOrderPriceAndFees?: OrderPriceAndFees
  algoOrderPriceAndFees?: OrderPriceAndFees
  providerFeeAmount?: string
  validUntil?: string
  retry: boolean
}): ReactElement {
  const { siteContent } = useMarketMetadata()
  const { accountId, balance, isSupportedOceanNetwork } = useWeb3()
  const { isValid, values }: FormikContextType<{ algorithm: string }> =
    useFormikContext()
  const { asset, isAssetNetwork } = useAsset()

  const [datasetOrderPrice, setDatasetOrderPrice] = useState(
    asset?.accessDetails?.price
  )
  const [algoOrderPrice, setAlgoOrderPrice] = useState(
    selectedAlgorithmAsset?.accessDetails?.price
  )
  const [totalPrices, setTotalPrices] = useState([])
  const [isBalanceSufficient, setIsBalanceSufficient] = useState<boolean>(true)

  function getAlgorithmAsset(algorithmId: string): Asset {
    let assetDdo = null
    ddoListAlgorithms.forEach((ddo: Asset) => {
      if (ddo.id === algorithmId) assetDdo = ddo
    })
    return assetDdo
  }

  useEffect(() => {
    if (!values.algorithm || !isConsumable) return

    async function fetchAlgorithmAssetExtended() {
      const algorithmAsset = getAlgorithmAsset(values.algorithm)
      const accessDetails = await getAccessDetails(
        algorithmAsset.chainId,
        algorithmAsset.services[0].datatokenAddress,
        algorithmAsset.services[0].timeout,
        accountId || ZERO_ADDRESS // if user is not connected, use ZERO_ADDRESS as accountId
      )
      const extendedAlgoAsset: AssetExtended = {
        ...algorithmAsset,
        accessDetails
      }
      setSelectedAlgorithm(extendedAlgoAsset)
    }
    fetchAlgorithmAssetExtended()
  }, [values.algorithm, accountId, isConsumable])

  //
  // Set price for calculation output
  //
  useEffect(() => {
    if (!asset?.accessDetails || !selectedAlgorithmAsset?.accessDetails) return

    setDatasetOrderPrice(
      datasetOrderPriceAndFees?.price || asset.accessDetails.price
    )
    setAlgoOrderPrice(
      algoOrderPriceAndFees?.price ||
        selectedAlgorithmAsset?.accessDetails.price
    )
    const totalPrices: totalPriceMap[] = []
    const priceDataset =
      !datasetOrderPrice || hasPreviousOrder || hasDatatoken
        ? new Decimal(0)
        : new Decimal(datasetOrderPrice).toDecimalPlaces(MAX_DECIMALS)
    const priceAlgo =
      !algoOrderPrice ||
      hasPreviousOrderSelectedComputeAsset ||
      hasDatatokenSelectedComputeAsset
        ? new Decimal(0)
        : new Decimal(algoOrderPrice).toDecimalPlaces(MAX_DECIMALS)
    const providerFees = providerFeeAmount
      ? new Decimal(providerFeeAmount).toDecimalPlaces(MAX_DECIMALS)
      : new Decimal(0)

    if (algorithmSymbol === providerFeesSymbol) {
      let sum = providerFees.add(priceAlgo)
      totalPrices.push({
        value: sum.toDecimalPlaces(MAX_DECIMALS).toString(),
        symbol: algorithmSymbol
      })
      if (algorithmSymbol === datasetSymbol) {
        sum = sum.add(priceDataset)
        totalPrices[0].value = sum.toDecimalPlaces(MAX_DECIMALS).toString()
      } else {
        totalPrices.push({
          value: priceDataset.toDecimalPlaces(MAX_DECIMALS).toString(),
          symbol: datasetSymbol
        })
      }
    } else {
      if (datasetSymbol === providerFeesSymbol) {
        const sum = providerFees.add(priceDataset)
        totalPrices.push({
          value: sum.toDecimalPlaces(MAX_DECIMALS).toString(),
          symbol: datasetSymbol
        })
        totalPrices.push({
          value: priceAlgo.toDecimalPlaces(MAX_DECIMALS).toString(),
          symbol: algorithmSymbol
        })
      } else if (datasetSymbol === algorithmSymbol) {
        const sum = priceAlgo.add(priceDataset)
        totalPrices.push({
          value: sum.toDecimalPlaces(MAX_DECIMALS).toString(),
          symbol: algorithmSymbol
        })
        totalPrices.push({
          value: providerFees.toDecimalPlaces(MAX_DECIMALS).toString(),
          symbol: providerFeesSymbol
        })
      } else {
        totalPrices.push({
          value: priceDataset.toDecimalPlaces(MAX_DECIMALS).toString(),
          symbol: datasetSymbol
        })
        totalPrices.push({
          value: providerFees.toDecimalPlaces(MAX_DECIMALS).toString(),
          symbol: providerFeesSymbol
        })
        totalPrices.push({
          value: priceAlgo.toDecimalPlaces(MAX_DECIMALS).toString(),
          symbol: algorithmSymbol
        })
      }
    }
    setTotalPrices(totalPrices)
  }, [
    asset,
    hasPreviousOrder,
    hasDatatoken,
    hasPreviousOrderSelectedComputeAsset,
    hasDatatokenSelectedComputeAsset,
    datasetOrderPriceAndFees,
    algoOrderPriceAndFees,
    providerFeeAmount,
    isAssetNetwork,
    selectedAlgorithmAsset?.accessDetails,
    datasetOrderPrice,
    algoOrderPrice,
    algorithmSymbol,
    datasetSymbol,
    providerFeesSymbol
  ])

  useEffect(() => {
    totalPrices.forEach((price) => {
      const baseTokenBalance = getTokenBalanceFromSymbol(balance, price.symbol)
      if (!baseTokenBalance) {
        setIsBalanceSufficient(false)
        return
      }

      // if one comparison of baseTokenBalance and token price comparison is false then the state will be false
      setIsBalanceSufficient(
        baseTokenBalance && compareAsBN(baseTokenBalance, `${price.value}`)
      )
    })
  }, [balance, dtBalance, datasetSymbol, algorithmSymbol, totalPrices])

  return (
    <Form className={styles.form}>
      {content.form.data.map((field: FormFieldContent) => {
        return (
          <Field
            key={field.name}
            {...field}
            options={algorithms}
            component={Input}
            disabled={isLoading || isComputeButtonDisabled}
          />
        )
      })}

      <PriceOutput
        hasPreviousOrder={hasPreviousOrder}
        assetTimeout={assetTimeout}
        hasPreviousOrderSelectedComputeAsset={
          hasPreviousOrderSelectedComputeAsset
        }
        hasDatatoken={hasDatatoken}
        selectedComputeAssetTimeout={selectedComputeAssetTimeout}
        hasDatatokenSelectedComputeAsset={hasDatatokenSelectedComputeAsset}
        algorithmConsumeDetails={selectedAlgorithmAsset?.accessDetails}
        symbol={datasetSymbol}
        algorithmSymbol={algorithmSymbol}
        datasetOrderPrice={datasetOrderPrice}
        algoOrderPrice={algoOrderPrice}
        providerFeeAmount={providerFeeAmount}
        providerFeesSymbol={providerFeesSymbol}
        validUntil={validUntil}
        totalPrices={totalPrices}
      />

      <ButtonBuy
        action="compute"
        disabled={
          isComputeButtonDisabled ||
          !isValid ||
          !isBalanceSufficient ||
          !isAssetNetwork ||
          !selectedAlgorithmAsset?.accessDetails?.isPurchasable
        }
        hasPreviousOrder={hasPreviousOrder}
        hasDatatoken={hasDatatoken}
        btSymbol={asset?.accessDetails?.baseToken?.symbol}
        dtSymbol={asset?.datatokens[0]?.symbol}
        dtBalance={dtBalance}
        assetTimeout={assetTimeout}
        assetType={assetType}
        hasPreviousOrderSelectedComputeAsset={
          hasPreviousOrderSelectedComputeAsset
        }
        hasDatatokenSelectedComputeAsset={hasDatatokenSelectedComputeAsset}
        dtSymbolSelectedComputeAsset={dtSymbolSelectedComputeAsset}
        dtBalanceSelectedComputeAsset={dtBalanceSelectedComputeAsset}
        selectedComputeAssetType={selectedComputeAssetType}
        stepText={stepText}
        isLoading={isLoading}
        type="submit"
        priceType={asset?.accessDetails?.type}
        algorithmPriceType={selectedAlgorithmAsset?.accessDetails?.type}
        isBalanceSufficient={isBalanceSufficient}
        isConsumable={isConsumable}
        consumableFeedback={consumableFeedback}
        isAlgorithmConsumable={
          selectedAlgorithmAsset?.accessDetails?.isPurchasable
        }
        isSupportedOceanNetwork={isSupportedOceanNetwork}
        hasProviderFee={providerFeeAmount && providerFeeAmount !== '0'}
        retry={retry}
      />
    </Form>
  )
}
