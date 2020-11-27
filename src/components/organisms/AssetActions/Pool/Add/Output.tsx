import { graphql, useStaticQuery } from 'gatsby'
import React, { ReactElement } from 'react'
import Token from '../Token'
import styles from './Output.module.css'

const contentQuery = graphql`
  query PoolAddOutputQuery {
    content: allFile(filter: { relativePath: { eq: "price.json" } }) {
      edges {
        node {
          childContentJson {
            pool {
              add {
                output {
                  titleIn
                  titleOut
                }
              }
            }
          }
        }
      }
    }
  }
`

export default function Output({
  newPoolTokens,
  newPoolShare,
  swapFee,
  dtSymbol
}: {
  newPoolTokens: string
  newPoolShare: string
  swapFee: string
  dtSymbol: string
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const {
    titleIn,
    titleOut
  } = data.content.edges[0].node.childContentJson.pool.add.output

  const poolOcean = '70'
  const poolDatatoken = '30'

  return (
    <div className={styles.output}>
      <div>
        <p>{titleIn}</p>
        <Token symbol="pool shares" balance={newPoolTokens} />
        <Token symbol="% of pool" balance={newPoolShare} />
        <Token symbol="% swap fee" balance={swapFee} />
      </div>
      <div>
        <p>Pool conversion</p>
        <Token symbol="OCEAN" balance={poolOcean} />
        <Token symbol={dtSymbol} balance={poolDatatoken} />
      </div>
    </div>
  )
}
