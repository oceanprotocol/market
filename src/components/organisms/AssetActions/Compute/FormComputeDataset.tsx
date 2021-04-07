import React, { ReactElement, useEffect, useState } from 'react'
import styles from './FormComputeDataset.module.css'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Input from '../../../atoms/Input'
import { FormFieldProps } from '../../../../@types/Form'
import { useStaticQuery, graphql } from 'gatsby'
import { DDO, BestPrice, Logger } from '@oceanprotocol/lib'
import { AssetSelectionAsset } from '../../../molecules/FormFields/AssetSelection'
import ButtonBuy from '../../../atoms/ButtonBuy'
import Decimal from 'decimal.js'
import PriceUnit from '../../../atoms/Price/PriceUnit'

const contentQuery = graphql`
  query StartComputeDatasetQuery {
    content: allFile(
      filter: { relativePath: { eq: "pages/startComputeDataset.json" } }
    ) {
      edges {
        node {
          childPagesJson {
            description
            form {
              success
              successAction
              error
              data {
                name
                label
                help
                type
                required
                sortOptions
                options
              }
            }
          }
        }
      }
    }
  }
`

export default function FormStartCompute({
  algorithms,
  ddoListAlgorithms,
  setSelectedAlgorithm,
  isLoading,
  isComputeButtonDisabled,
  hasPreviousOrder,
  hasDatatoken,
  dtSymbol,
  dtBalance,
  assetType,
  assetTimeout,
  hasPreviousOrderSelectedComputeAsset,
  hasDatatokenSelectedComputeAsset,
  dtSymbolSelectedComputeAsset,
  dtBalanceSelectedComputeAsset,
  selectedComputeAssetType,
  selectedComputeAssetTimeout,
  stepText,
  algorithmPrice,
  ddoPrice
}: {
  algorithms: AssetSelectionAsset[]
  ddoListAlgorithms: DDO[]
  setSelectedAlgorithm: React.Dispatch<React.SetStateAction<DDO>>
  isLoading: boolean
  isComputeButtonDisabled: boolean
  hasPreviousOrder: boolean
  hasDatatoken: boolean
  dtSymbol: string
  dtBalance: string
  assetType: string
  assetTimeout: string
  hasPreviousOrderSelectedComputeAsset?: boolean
  hasDatatokenSelectedComputeAsset?: boolean
  dtSymbolSelectedComputeAsset?: string
  dtBalanceSelectedComputeAsset?: string
  selectedComputeAssetType?: string
  selectedComputeAssetTimeout?: string
  stepText: string
  algorithmPrice: BestPrice
  ddoPrice: BestPrice
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childPagesJson

  const {
    isValid,
    values
  }: FormikContextType<{ algorithm: string }> = useFormikContext()
  const [totalPrice, setTotalPrice] = useState<string>(
    ddoPrice?.value.toString()
  )

  function getAlgorithmAsset(algorithmId: string): DDO {
    let assetDdo = null
    ddoListAlgorithms.forEach((ddo: DDO) => {
      if (ddo.id === algorithmId) assetDdo = ddo
    })
    return assetDdo
  }

  useEffect(() => {
    if (!values.algorithm) return
    setSelectedAlgorithm(getAlgorithmAsset(values.algorithm))
  }, [values.algorithm])

  //
  // Set price for calculation output
  //
  useEffect(() => {
    if (!ddoPrice || !algorithmPrice) return

    const priceDataset = hasPreviousOrder ? 0 : Number(ddoPrice.value)
    const priceAlgo = hasPreviousOrderSelectedComputeAsset
      ? 0
      : Number(algorithmPrice.value)

    setTotalPrice(`${priceDataset + priceAlgo}`)
  }, [
    ddoPrice,
    algorithmPrice,
    hasPreviousOrder,
    hasPreviousOrderSelectedComputeAsset
  ])

  return (
    <Form className={styles.form}>
      {content.form.data.map((field: FormFieldProps) => (
        <Field
          key={field.name}
          {...field}
          options={algorithms}
          component={Input}
        />
      ))}
      <div className={styles.priceComponent}>
        <h3>You will pay</h3>
        <div className={styles.calculation}>
          <div className={styles.priceRow}>
            <div />
            <div>
              <PriceUnit
                price={hasPreviousOrder ? '0' : `${ddoPrice?.value}`}
                small
                className={styles.price}
              />
              <span className={styles.timeout}>
                {assetTimeout !== 'Forever' &&
                  !hasPreviousOrder &&
                  `for ${assetTimeout}`}
              </span>
            </div>
          </div>
          <div className={styles.priceRow}>
            <div className={styles.sign}>+</div>
            <div>
              <PriceUnit
                price={
                  hasPreviousOrderSelectedComputeAsset
                    ? '0'
                    : `${algorithmPrice?.value}`
                }
                small
                className={styles.price}
              />
              <span className={styles.timeout}>
                {selectedComputeAssetTimeout !== 'Forever' &&
                  !hasPreviousOrderSelectedComputeAsset &&
                  `for ${selectedComputeAssetTimeout}`}
              </span>
            </div>
          </div>
          <div className={styles.priceRow}>
            <div className={styles.sign}>=</div>
            <PriceUnit price={totalPrice} className={styles.price} small />
          </div>
        </div>
      </div>
      <ButtonBuy
        action="compute"
        disabled={isComputeButtonDisabled || !isValid}
        hasPreviousOrder={hasPreviousOrder}
        hasDatatoken={hasDatatoken}
        dtSymbol={dtSymbol}
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
      />
    </Form>
  )
}
