import React, { ReactElement, useEffect } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import styles from './index.module.css'
import Tabs from '../../../atoms/Tabs'
import Fixed from './Fixed'
import Dynamic from './Dynamic'
import { useFormikContext } from 'formik'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import ddo from '../../../../../tests/unit/__fixtures__/ddo'
import { PriceOptionsMarket } from '../../../../@types/MetaData'

const query = graphql`
  query PriceFieldQuery {
    content: allFile(filter: { relativePath: { eq: "pages/publish.json" } }) {
      edges {
        node {
          childPagesJson {
            price {
              fixed {
                title
                info
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
            }
          }
        }
      }
    }
  }
`

export default function Price(): ReactElement {
  const { debug } = useUserPreferences()
  const data = useStaticQuery(query)
  const content = data.content.edges[0].node.childPagesJson.price

  const { values, setFieldValue } = useFormikContext()
  const { price, weightOnDataToken, type } = values as PriceOptionsMarket

  function handleTabChange(tabName: string) {
    const type = tabName.toLowerCase()
    setFieldValue('type', type)
  }

  // Always update everything when price changes
  useEffect(() => {
    const dtAmount = Number(price) * Number(weightOnDataToken)
    setFieldValue('dtAmount', dtAmount)
  }, [price])

  const tabs = [
    {
      title: content.fixed.title,
      content: <Fixed content={content.fixed} />
    },
    {
      title: content.dynamic.title,
      content: (
        <Dynamic
          datatokenOptions={ddo.dataTokenInfo}
          content={content.dynamic}
        />
      )
    }
  ]

  return (
    <div className={styles.price}>
      <Tabs
        items={tabs}
        handleTabChange={handleTabChange}
        defaultIndex={type === 'fixed' ? 0 : 1}
      />
      {debug === true && (
        <pre>
          <code>{JSON.stringify(values, null, 2)}</code>
        </pre>
      )}
    </div>
  )
}
