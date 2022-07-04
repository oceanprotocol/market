import React, { ReactElement, useEffect, useState } from 'react'
import styles from './FormComputeDataset.module.css'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Input from '@shared/FormInput'
import { AssetSelectionAsset } from '@shared/FormFields/AssetSelection'
import { compareAsBN } from '@utils/numbers'
import ButtonBuy from '@shared/ButtonBuy'
import PriceOutput from './PriceOutput'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import content from '../../../../../content/pages/startComputeDataset.json'
import { Asset } from '@oceanprotocol/lib'
import { OrderPriceAndFees } from 'src/@types/Price'
import { getAccessDetails } from '@utils/accessDetailsAndPricing'
import { AssetExtended } from 'src/@types/AssetExtended'
import Decimal from 'decimal.js'
import { MAX_DECIMALS } from '@utils/constants'
import { useMarketMetadata } from '@context/MarketMetadata'
import Alert from '@shared/atoms/Alert'

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
  datasetLowPoolLiquidity,
  assetType,
  assetTimeout,
  hasPreviousOrderSelectedComputeAsset,
  hasDatatokenSelectedComputeAsset,
  oceanSymbol,
  dtSymbolSelectedComputeAsset,
  dtBalanceSelectedComputeAsset,
  selectedComputeAssetLowPoolLiquidity,
  selectedComputeAssetType,
  selectedComputeAssetTimeout,
  stepText,
  isConsumable,
  consumableFeedback,
  datasetOrderPriceAndFees,
  algoOrderPriceAndFees,
  providerFeeAmount,
  validUntil
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
  datasetLowPoolLiquidity: boolean
  assetType: string
  assetTimeout: string
  hasPreviousOrderSelectedComputeAsset?: boolean
  hasDatatokenSelectedComputeAsset?: boolean
  oceanSymbol?: string
  dtSymbolSelectedComputeAsset?: string
  dtBalanceSelectedComputeAsset?: string
  selectedComputeAssetLowPoolLiquidity?: boolean
  selectedComputeAssetType?: string
  selectedComputeAssetTimeout?: string
  stepText: string
  isConsumable: boolean
  consumableFeedback: string
  datasetOrderPriceAndFees?: OrderPriceAndFees
  algoOrderPriceAndFees?: OrderPriceAndFees
  providerFeeAmount?: string
  validUntil?: string
}): ReactElement {
  const { siteContent } = useMarketMetadata()
  const { accountId, balance } = useWeb3()
  const { isValid, values }: FormikContextType<{ algorithm: string }> =
    useFormikContext()
  const { asset, isAssetNetwork } = useAsset()

  const [totalPrice, setTotalPrice] = useState('0')
  const [datasetOrderPrice, setDatasetOrderPrice] = useState(
    asset?.accessDetails?.price
  )
  const [algoOrderPrice, setAlgoOrderPrice] = useState(
    selectedAlgorithmAsset?.accessDetails?.price
  )
  const [isBalanceSufficient, setIsBalanceSufficient] = useState<boolean>(false)

  function getAlgorithmAsset(algorithmId: string): Asset {
    let assetDdo = null
    ddoListAlgorithms.forEach((ddo: Asset) => {
      if (ddo.id === algorithmId) assetDdo = ddo
    })
    return assetDdo
  }

  useEffect(() => {
    if (!values.algorithm || !accountId || !isConsumable) return

    async function fetchAlgorithmAssetExtended() {
      const algorithmAsset = getAlgorithmAsset(values.algorithm)
      const accessDetails = await getAccessDetails(
        algorithmAsset.chainId,
        algorithmAsset.services[0].datatokenAddress,
        algorithmAsset.services[0].timeout,
        accountId
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
    const priceDataset =
      hasPreviousOrder || hasDatatoken
        ? new Decimal(0)
        : new Decimal(
            datasetOrderPriceAndFees?.price || asset.accessDetails.price
          ).toDecimalPlaces(MAX_DECIMALS)
    const priceAlgo =
      hasPreviousOrderSelectedComputeAsset || hasDatatokenSelectedComputeAsset
        ? new Decimal(0)
        : new Decimal(
            algoOrderPriceAndFees?.price ||
              selectedAlgorithmAsset.accessDetails.price
          ).toDecimalPlaces(MAX_DECIMALS)
    const providerFees = providerFeeAmount
      ? new Decimal(providerFeeAmount).toDecimalPlaces(MAX_DECIMALS)
      : new Decimal(0)
    const totalPrice = priceDataset
      .plus(priceAlgo)
      .plus(providerFees)
      .toDecimalPlaces(MAX_DECIMALS)
      .toString()
    setTotalPrice(totalPrice)
  }, [
    asset?.accessDetails,
    selectedAlgorithmAsset?.accessDetails,
    hasPreviousOrder,
    hasDatatoken,
    hasPreviousOrderSelectedComputeAsset,
    hasDatatokenSelectedComputeAsset,
    datasetOrderPriceAndFees,
    algoOrderPriceAndFees,
    providerFeeAmount
  ])

  useEffect(() => {
    if (!totalPrice || !balance?.ocean || !dtBalance) return

    setIsBalanceSufficient(
      compareAsBN(balance.ocean, `${totalPrice}`) || Number(dtBalance) >= 1
    )
  }, [totalPrice, balance?.ocean, dtBalance])

  return (
    <Form className={styles.form}>
      <Alert
        className={styles.warning}
        state="info"
        text={siteContent.warning.ctd}
      />
      {content.form.data.map((field: FormFieldContent) => (
        <Field
          key={field.name}
          {...field}
          options={algorithms}
          component={Input}
          disabled={isLoading}
        />
      ))}

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
        symbol={oceanSymbol}
        totalPrice={totalPrice}
        datasetOrderPrice={datasetOrderPrice}
        algoOrderPrice={algoOrderPrice}
        providerFeeAmount={providerFeeAmount}
        validUntil={validUntil}
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
        dtSymbol={asset?.datatokens[0]?.symbol}
        dtBalance={dtBalance}
        datasetLowPoolLiquidity={datasetLowPoolLiquidity}
        assetTimeout={assetTimeout}
        assetType={assetType}
        hasPreviousOrderSelectedComputeAsset={
          hasPreviousOrderSelectedComputeAsset
        }
        hasDatatokenSelectedComputeAsset={hasDatatokenSelectedComputeAsset}
        dtSymbolSelectedComputeAsset={dtSymbolSelectedComputeAsset}
        dtBalanceSelectedComputeAsset={dtBalanceSelectedComputeAsset}
        selectedComputeAssetLowPoolLiquidity={
          selectedComputeAssetLowPoolLiquidity
        }
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
        hasProviderFee={providerFeeAmount && providerFeeAmount !== '0'}
      />
    </Form>
  )
}
