import React, { ReactElement, useState, ChangeEvent, useEffect } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { InputProps } from '../../../atoms/Input'
import styles from './index.module.css'
import Tabs from '../../../atoms/Tabs'
import Fixed from './Fixed'
import Dynamic from './Dynamic'
import { useField } from 'formik'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import { DataTokenOptions, PriceOptions, useOcean } from '@oceanprotocol/react'

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
                  liquidityProviderFee
                }
              }
            }
          }
        }
      }
    }
  }
`

export default function Price(props: InputProps): ReactElement {
  const { debug } = useUserPreferences()
  const data = useStaticQuery(query)
  const content = data.content.edges[0].node.childPagesJson.price
  const { ocean } = useOcean()

  const [field, meta, helpers] = useField(props)
  const priceOptions: PriceOptions = field.value

  const [amountOcean, setAmountOcean] = useState('1')
  const [tokensToMint, setTokensToMint] = useState<number>()
  const [datatokenOptions, setDatatokenOptions] = useState<DataTokenOptions>()

  function handleOceanChange(event: ChangeEvent<HTMLInputElement>) {
    setAmountOcean(event.target.value)
  }

  function handleTabChange(tabName: string) {
    const type = tabName.toLowerCase()
    helpers.setValue({ ...field.value, type })
  }

  // Always update everything when amountOcean changes
  useEffect(() => {
    const tokensToMint =
      Number(amountOcean) * Number(priceOptions.weightOnDataToken)
    setTokensToMint(tokensToMint)
    helpers.setValue({ ...field.value, tokensToMint })
  }, [amountOcean])

  // Generate new DT name & symbol
  useEffect(() => {
    if (!ocean) return
    const newDatatokenOptions = ocean.datatokens.generateDtName()
    setDatatokenOptions(newDatatokenOptions)
  }, [ocean])

  const tabs = [
    {
      title: content.fixed.title,
      content: (
        <Fixed
          ocean={amountOcean}
          datatokenOptions={datatokenOptions}
          onChange={handleOceanChange}
          content={content.fixed}
        />
      )
    },
    {
      title: content.dynamic.title,
      content: (
        <Dynamic
          ocean={amountOcean}
          priceOptions={{ ...priceOptions, tokensToMint }}
          datatokenOptions={datatokenOptions}
          onOceanChange={handleOceanChange}
          content={content.dynamic}
        />
      )
    }
  ]

  return (
    <div className={styles.price}>
      <Tabs items={tabs} handleTabChange={handleTabChange} />
      {debug === true && (
        <pre>
          <code>{JSON.stringify(field.value)}</code>
        </pre>
      )}
    </div>
  )
}
