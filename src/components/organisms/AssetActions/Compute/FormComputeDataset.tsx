import React, { ReactElement, useEffect, useState } from 'react'
import styles from './FormComputeDataset.module.css'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Input from '../../../atoms/Input'
import { FormFieldProps } from '../../../../@types/Form'
import { useStaticQuery, graphql } from 'gatsby'
import { DDO, BestPrice } from '@oceanprotocol/lib'
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
  stepText,
  datasetTimeout,
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
  stepText: string
  datasetTimeout: string
  algorithmPrice: BestPrice
  ddoPrice: BestPrice
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childPagesJson

  const {
    isValid,
    values
  }: FormikContextType<{ algorithm: string }> = useFormikContext()
  const [totalPrice, setTotalPrice] = useState<string>(ddoPrice?.value)

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

  useEffect(() => {
    if (!ddoPrice || !algorithmPrice) return
    const totalValue = new Decimal(ddoPrice.value).add(
      new Decimal(algorithmPrice.value)
    )
    setTotalPrice(totalValue.toString())
  }, [ddoPrice, algorithmPrice])

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
        <div>
          <div className={styles.sign}></div>
          <PriceUnit price={ddoPrice?.value} small className={styles.price} />
        </div>
        <div className={styles.priceRow}>
          <div className={styles.sign}>+</div>
          <PriceUnit
            price={algorithmPrice?.value}
            small
            className={styles.price}
          />
        </div>
        <div>
          <div className={styles.sign}>=</div>
          <PriceUnit price={totalPrice} small className={styles.price} />
        </div>
      </div>
      <ButtonBuy
        action="compute"
        disabled={isComputeButtonDisabled || !isValid}
        hasPreviousOrder={hasPreviousOrder}
        hasDatatoken={hasDatatoken}
        dtSymbol={dtSymbol}
        dtBalance={dtBalance}
        stepText={stepText}
        isLoading={isLoading}
        type="submit"
        assetTimeout={datasetTimeout}
      />
    </Form>
  )
}
