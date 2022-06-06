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
import { useMarketMetadata } from '@context/MarketMetadata'
import Alert from '@shared/atoms/Alert'

export default function FormStartCompute({
  algorithms,
  ddoListAlgorithms,
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
  algorithmConsumeDetails,
  isConsumable,
  consumableFeedback
}: {
  algorithms: AssetSelectionAsset[]
  ddoListAlgorithms: Asset[]
  setSelectedAlgorithm: React.Dispatch<React.SetStateAction<Asset>>
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
  algorithmConsumeDetails: AccessDetails
  isConsumable: boolean
  consumableFeedback: string
}): ReactElement {
  const { siteContent } = useMarketMetadata()
  const { isValid, values }: FormikContextType<{ algorithm: string }> =
    useFormikContext()
  const { asset, isAssetNetwork } = useAsset()
  const [totalPrice, setTotalPrice] = useState(asset?.accessDetails?.price)
  const [isBalanceSufficient, setIsBalanceSufficient] = useState<boolean>(false)
  const { accountId, balance } = useWeb3()
  const [algorithmConsumableStatus, setAlgorithmConsumableStatus] =
    useState<number>()

  function getAlgorithmAsset(algorithmId: string): Asset {
    let assetDdo = null
    ddoListAlgorithms.forEach((ddo: Asset) => {
      if (ddo.id === algorithmId) assetDdo = ddo
    })
    return assetDdo
  }

  useEffect(() => {
    if (!values.algorithm) return
    const algorithmDDO = getAlgorithmAsset(values.algorithm)
    setSelectedAlgorithm(algorithmDDO)

    if (!accountId || !isConsumable) return
    async function checkIsConsumable() {
      // const consumable = await ocean.assets.isConsumable(
      //   algorithmDDO as any,
      //   accountId.toLowerCase()
      // )
      // if (consumable) setAlgorithmConsumableStatus(consumable.status)
    }
    checkIsConsumable()
  }, [values.algorithm, accountId, isConsumable])

  //
  // Set price for calculation output
  //
  useEffect(() => {
    if (!asset?.accessDetails || !algorithmConsumeDetails) return

    const priceDataset =
      hasPreviousOrder || hasDatatoken ? 0 : Number(asset.accessDetails.price)
    const priceAlgo =
      hasPreviousOrderSelectedComputeAsset || hasDatatokenSelectedComputeAsset
        ? 0
        : Number(algorithmConsumeDetails.price)

    setTotalPrice((priceDataset + priceAlgo).toString())
  }, [
    asset?.accessDetails,
    algorithmConsumeDetails,
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
        algorithmConsumeDetails={algorithmConsumeDetails}
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
          algorithmConsumableStatus > 0
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
        algorithmPriceType={algorithmConsumeDetails?.type}
        isBalanceSufficient={isBalanceSufficient}
        isConsumable={isConsumable}
        consumableFeedback={consumableFeedback}
        algorithmConsumableStatus={algorithmConsumableStatus}
      />
    </Form>
  )
}
