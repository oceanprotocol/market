import React, { ReactElement, useState, ChangeEvent, useEffect } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { InputProps } from '../../../atoms/Input'
import styles from './index.module.css'
import Tabs from '../../../atoms/Tabs'
import Simple from './Simple'
import Advanced from './Advanced'
import { useField } from 'formik'

const query = graphql`
  query PriceFieldQuery {
    content: allFile(filter: { relativePath: { eq: "pages/publish.json" } }) {
      edges {
        node {
          childPagesJson {
            price {
              simple {
                title
                info
              }
              advanced {
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
    const type = tabName.startsWith('Simple') ? 'simple' : 'advanced'
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
      title: content.simple.title,
      content: (
        <Simple
          ocean={ocean}
          onChange={handleOceanChange}
          content={content.simple}
        />
      )
    },
    {
      title: content.advanced.title,
      content: (
        <Advanced
          ocean={ocean}
          tokensToMint={tokensToMint}
          weightOnDataToken={weightOnDataToken}
          onOceanChange={handleOceanChange}
          liquidityProviderFee={liquidityProviderFee}
          content={content.advanced}
        />
      )
    }
  ]

  return (
    <div className={styles.price}>
      <Tabs items={tabs} handleTabChange={handleTabChange} />
      <pre>
        <code>{JSON.stringify(field.value)}</code>
      </pre>
    </div>
  )
}
