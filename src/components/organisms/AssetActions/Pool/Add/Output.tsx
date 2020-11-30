import { FormikContextType, useFormikContext } from 'formik'
import { graphql, useStaticQuery } from 'gatsby'
import React, { ReactElement, useEffect, useState } from 'react'
import { FormAddLiquidity } from '.'
import TokenBalance from '../../../../../@types/TokenBalance'
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
                  help
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
  dtSymbol,
  totalPoolTokens,
  totalBalance,
  coin
}: {
  newPoolTokens: string
  newPoolShare: string
  swapFee: string
  dtSymbol: string
  totalPoolTokens: string
  totalBalance: TokenBalance
  coin: string
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const {
    help,
    titleIn,
    titleOut
  } = data.content.edges[0].node.childContentJson.pool.add.output

  // Connect with form
  const { values }: FormikContextType<FormAddLiquidity> = useFormikContext()

  const [poolOcean, setPoolOcean] = useState('0')
  const [poolDatatoken, setPoolDatatoken] = useState('0')

  useEffect(() => {
    if (!values.amount || !totalBalance || !totalPoolTokens) return

    const newPoolSupply = Number(totalPoolTokens) + Number(newPoolShare)
    const ratio = Number(newPoolShare) / newPoolSupply

    const newOceanReserve =
      coin === 'OCEAN'
        ? Number(totalBalance.ocean) + Number(values.amount)
        : totalBalance.ocean
    const newDtReserve =
      coin === 'OCEAN'
        ? totalBalance.datatoken
        : Number(totalBalance.datatoken) + Number(values.amount)

    const poolOcean = `${Number(newOceanReserve) * ratio}`
    const poolDatatoken = `${Number(newDtReserve) * ratio}`
    setPoolOcean(poolOcean)
    setPoolDatatoken(poolDatatoken)
  }, [values.amount, coin, totalBalance, totalPoolTokens, newPoolShare])

  return (
    <>
      <FormHelp className={styles.help}>
        {help.replace('SWAPFEE', swapFee)}
      </FormHelp>
      <div className={styles.output}>
        <div>
          <p>{titleIn}</p>
          <Token symbol="pool shares" balance={newPoolTokens} />
          <Token symbol="% of pool" balance={newPoolShare} />
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
