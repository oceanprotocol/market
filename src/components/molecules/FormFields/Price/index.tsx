import React, { ReactElement, useState, ChangeEvent, useEffect } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { InputProps } from '../../../atoms/Input'
import styles from './index.module.css'
import Tabs from '../../../atoms/Tabs'
import Fixed from './Fixed'
import Dynamic from './Dynamic'
import { useField } from 'formik'
import { useUserPreferences } from '../../../../providers/UserPreferences'

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

  const [field, meta, helpers] = useField(props)
  const { weightOnDataToken, liquidityProviderFee } = field.value

  const [ocean, setOcean] = useState('1')
  const [tokensToMint, setTokensToMint] = useState<number>()

  function handleOceanChange(event: ChangeEvent<HTMLInputElement>) {
    setOcean(event.target.value)
  }

  function handleTabChange(tabName: string) {
    const type = tabName.toLowerCase()
    helpers.setValue({ ...field.value, type })
  }

  // Always update everything when ocean changes
  useEffect(() => {
    const tokensToMint = Number(ocean) * Number(weightOnDataToken)
    setTokensToMint(tokensToMint)
    helpers.setValue({ ...field.value, tokensToMint })
  }, [ocean])

  const tabs = [
    {
      title: content.fixed.title,
      content: (
        <Fixed
          ocean={ocean}
          onChange={handleOceanChange}
          content={content.fixed}
        />
      )
    },
    {
      title: content.dynamic.title,
      content: (
        <Dynamic
          ocean={ocean}
          tokensToMint={tokensToMint}
          weightOnDataToken={weightOnDataToken}
          onOceanChange={handleOceanChange}
          liquidityProviderFee={liquidityProviderFee}
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
