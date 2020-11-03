import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean, useMetadata, usePricing } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'
import styles from './index.module.css'
import PriceUnit from '../../../atoms/Price/PriceUnit'
import * as Yup from 'yup'
import Conversion from '../../../atoms/Price/Conversion'
import EtherscanLink from '../../../atoms/EtherscanLink'

import { Formik } from 'formik'
import { toast } from 'react-toastify'
import Actions from '../Pool/Actions'
import { graphql, useStaticQuery } from 'gatsby'
import TradeForm from './TradeForm'
export interface TradeValue {
  amount: number
  token: string
  maxAmount: number
}
export interface TradeLiquidity {
  buyToken: number
  sellToken: number
}

const contentQuery = graphql`
  query TradeQuery {
    content: allFile(filter: { relativePath: { eq: "price.json" } }) {
      edges {
        node {
          childContentJson {
            trade {
              title
              action
            }
          }
        }
      }
    }
  }
`

const initialValues: TradeLiquidity = {
  buyToken: undefined,
  sellToken: undefined
}

export default function Trade({ ddo }: { ddo: DDO }): ReactElement {
  const data = useStaticQuery(contentQuery)
  const content = data.content.edges[0].node.childContentJson.trade

  const { ocean, networkId, balance } = useOcean()
  const { price, refreshPrice } = useMetadata(ddo)
  const { dtSymbol } = usePricing(ddo)
  const [poolAddress, setPoolAddress] = useState<string>()
  // the purpose of the value is just to trigger the effect
  const [refreshPool, setRefreshPool] = useState(false)
  const [txId, setTxId] = useState<string>()
  const validationSchema = Yup.object().shape<TradeLiquidity>({
    buyToken:  Yup.number()
        .min(0.01, 'Must be more or equal to 0.01')
        .required('Required'),
    sellToken: Yup.number()
        .min(0.01, 'Must be more or equal to 0.01')
        .required('Required')
  })

  const refreshInfo = async () => {
    setRefreshPool(!refreshPool)
    await refreshPrice()
  }

  useEffect(() => {
    if (!price) return
    setPoolAddress(price.address)
  }, [price])

  // Get maximum amount for either OCEAN or datatoken
  useEffect(() => {
    if (!ocean || !poolAddress) return

    async function getMaximum() {}
    getMaximum()
  }, [ocean, poolAddress, balance.ocean])

  async function handleTrade(values: TradeLiquidity, resetForm: () => void) {
    try {
      console.log(values)
    } catch (error) {
      console.error(error.message)
      toast.error(error.message)
    }
  }

  return (
    <>
      <div className={styles.dataToken}>
        <PriceUnit price="1" symbol={dtSymbol} /> ={' '}
        <PriceUnit price={`${price?.value}`} />
        <Conversion price={`${price?.value}`} />
        <div className={styles.dataTokenLinks}>
          <EtherscanLink
            networkId={networkId}
            path={`address/${price?.address}`}
          >
            Pool
          </EtherscanLink>
          <EtherscanLink networkId={networkId} path={`token/${ddo.dataToken}`}>
            Datatoken
          </EtherscanLink>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          await handleTrade(values, resetForm)
          setSubmitting(false)
        }}
      >
        {({ isSubmitting, submitForm }) => (
          <>
            <TradeForm ddo={ddo} />

            <Actions
              isLoading={isSubmitting}
              loaderMessage="Swaping tokens..."
              successMessage="Successfully swaped tokens."
              actionName={content.action}
              action={submitForm}
              txId={txId}
            />
          </>
        )}
      </Formik>
    </>
  )
}
