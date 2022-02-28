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
import { AccessDetails } from 'src/@types/Price'
import { getAccessDetailsForAssets } from '@utils/accessDetailsAndPricing'
import { AssetExtended } from 'src/@types/AssetExtended'

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
  consumableFeedback
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
}): ReactElement {
  const { isValid, values }: FormikContextType<{ algorithm: string }> =
    useFormikContext()
  const { asset, isAssetNetwork } = useAsset()
  const [totalPrice, setTotalPrice] = useState(asset?.accessDetails?.price)
  const [isBalanceSufficient, setIsBalanceSufficient] = useState<boolean>(false)
  const { accountId, balance } = useWeb3()

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
      const algorithmDDO = getAlgorithmAsset(values.algorithm)
      const extendedAlgoAsset = await getAccessDetailsForAssets([algorithmDDO])
      setSelectedAlgorithm(extendedAlgoAsset[0])
    }
    fetchAlgorithmAssetExtended()
  }, [values.algorithm, accountId, isConsumable])

  //
  // Set price for calculation output
  //
  useEffect(() => {
    if (!asset?.accessDetails || !selectedAlgorithmAsset?.accessDetails) return

    const priceDataset =
      hasPreviousOrder || hasDatatoken ? 0 : Number(asset.accessDetails.price)
    const priceAlgo =
      hasPreviousOrderSelectedComputeAsset || hasDatatokenSelectedComputeAsset
        ? 0
        : Number(selectedAlgorithmAsset?.accessDetails.price)

    setTotalPrice((priceDataset + priceAlgo).toString())
  }, [
    asset?.accessDetails,
    selectedAlgorithmAsset?.accessDetails,
    hasPreviousOrder,
    hasDatatoken,
    hasPreviousOrderSelectedComputeAsset,
    hasDatatokenSelectedComputeAsset
  ])

  useEffect(() => {
    if (!totalPrice) return
    setIsBalanceSufficient(
      compareAsBN(balance.ocean, `${totalPrice}`) || Number(dtBalance) >= 1
    )
  }, [totalPrice])

  return (
    <Form className={styles.form}>
      {content.form.data.map((field: FormFieldContent) => (
        <Field
          key={field.name}
          {...field}
          options={algorithms}
          component={Input}
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
        totalPrice={Number.parseFloat(totalPrice)}
      />

      <ButtonBuy
        action="compute"
        disabled={
          isComputeButtonDisabled ||
          !isValid ||
          !isBalanceSufficient ||
          !isAssetNetwork ||
          !selectedAlgorithmAsset?.accessDetails.isPurchasable
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
      />
    </Form>
  )
}
