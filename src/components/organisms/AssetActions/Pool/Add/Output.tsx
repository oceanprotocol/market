import { graphql, useStaticQuery } from 'gatsby'
import React, { ReactElement } from 'react'
import FormHelp from '../../../../atoms/Input/Help'
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

  // TODO: calculation fun!
  const poolOcean = '70'
  const poolDatatoken = '30'

  return (
    <>
      <FormHelp className={styles.help}>
        {`Providing liquidity will earn you ${swapFee}% on every
        transaction happening in this pool, proportionally to your share of the
        pool. Your token input will be converted based on the weight of the pool.`}
      </FormHelp>
      <div className={styles.output}>
        <div>
          <p>{titleIn}</p>
          <Token symbol="pool shares" balance={newPoolTokens} />
          <Token symbol="% of pool" balance={newPoolShare} />
          {/* <Token symbol="% swap fee" balance={swapFee} /> */}
        </div>
        <div>
          <p>{titleOut}</p>
          <Token symbol="OCEAN" balance={poolOcean} />
          <Token symbol={dtSymbol} balance={poolDatatoken} />
        </div>
      </div>
    </>
  )
}
