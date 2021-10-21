import React, { ReactElement, useEffect } from 'react'
import { useFormikContext } from 'formik'
import { DDO } from '@oceanprotocol/lib'
import { graphql, useStaticQuery } from 'gatsby'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import Tabs from '@shared/atoms/Tabs'
import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'
import { FormPublishData } from '../../_types'
import Dynamic from './Dynamic'
import Fixed from './Fixed'
import Free from './Free'

const query = graphql`
  query PricingQuery {
    content: allFile(filter: { relativePath: { eq: "price.json" } }) {
      edges {
        node {
          childContentJson {
            create {
              empty {
                title
                info
                action {
                  name
                  help
                }
              }
              fixed {
                title
                info
                tooltips {
                  communityFee
                  marketplaceFee
                }
              }
              dynamic {
                title
                info
                tooltips {
                  poolInfo
                  swapFee
                  communityFee
                  marketplaceFee
                }
              }
              free {
                title
                info
              }
            }
          }
        }
      }
    }
  }
`

export default function Pricing(): ReactElement {
  // Get content
  const data = useStaticQuery(query)
  const content = data.content.edges[0].node.childContentJson.create

  const { appConfig } = useSiteMetadata()

  // Connect with main publish form
  const { values, setFieldValue } = useFormikContext<FormPublishData>()
  const { pricing } = values
  const { price, oceanAmount, weightOnOcean, weightOnDataToken, type } = pricing

  // Switch type value upon tab change
  function handleTabChange(tabName: string) {
    const type = tabName.toLowerCase()
    setFieldValue('pricing.type', type)
    type === 'fixed' && setFieldValue('pricing.dtAmount', 1000)
    type === 'free' && price < 1 && setFieldValue('pricing.price', 1)
  }

  // Always update everything when price value changes
  useEffect(() => {
    if (type === 'fixed') return
    const dtAmount =
      isValidNumber(oceanAmount) &&
      isValidNumber(weightOnOcean) &&
      isValidNumber(price) &&
      isValidNumber(weightOnDataToken)
        ? new Decimal(oceanAmount)
            .dividedBy(new Decimal(weightOnOcean))
            .dividedBy(new Decimal(price))
            .mul(new Decimal(weightOnDataToken))
        : 0

    setFieldValue('pricing.dtAmount', dtAmount)
  }, [price, oceanAmount, weightOnOcean, weightOnDataToken, type])

  const tabs = [
    appConfig.allowFixedPricing === 'true'
      ? {
          title: content.fixed.title,
          content: <Fixed content={content.fixed} />
        }
      : undefined,
    appConfig.allowDynamicPricing === 'true'
      ? {
          title: content.dynamic.title,
          content: <Dynamic content={content.dynamic} />
        }
      : undefined,
    appConfig.allowFreePricing === 'true'
      ? {
          title: content.free.title,
          content: <Free content={content.free} />
        }
      : undefined
  ].filter((tab) => tab !== undefined)

  return (
    <Tabs
      items={tabs}
      handleTabChange={handleTabChange}
      defaultIndex={type === 'fixed' ? 0 : 1}
    />
  )

  // async function handleCreatePricing(values: PriceOptions) {
  //   try {
  //     const priceOptions = {
  //       ...values,
  //       // swapFee is tricky: to get 0.1% you need to send 0.001 as value
  //       swapFee: `${values.swapFee / 100}`
  //     }

  //     const tx = await createPricing(priceOptions, ddo)

  //     // Pricing failed
  //     if (!tx || pricingError) {
  //       toast.error(pricingError || 'Price creation failed.')
  //       Logger.error(pricingError || 'Price creation failed.')
  //       return
  //     }

  //     // Pricing succeeded
  //     setSuccess(
  //       `🎉 Successfully created a ${values.type} price. 🎉 Reload the page to get all updates.`
  //     )
  //     Logger.log(`Transaction: ${tx}`)
  //   } catch (error) {
  //     toast.error(error.message)
  //     Logger.error(error.message)
  //   }
  // }
}
