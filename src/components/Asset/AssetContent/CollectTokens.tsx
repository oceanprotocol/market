import React, { ReactElement, useState, useEffect } from 'react'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import { gql, OperationResult } from 'urql'
import { fetchData, getQueryContext } from '@utils/subgraph'
import { FixedRateExchanges } from 'src/@types/subgraph/FixedRateExchanges'
import Tooltip from '@shared/atoms/Tooltip'
import { FixedRateExchange, LoggerInstance } from '@oceanprotocol/lib'
import Loader from '@shared/atoms/Loader'
import Button from '@shared/atoms/Button'
import styles from './CollectTokens.module.css'

const FixedRateExchangesQuery = gql`
  query FixedRateExchanges($user: String, $exchangeId: String) {
    fixedRateExchanges(where: { owner: $user, exchangeId: $exchangeId }) {
      id
      owner {
        id
      }
      exchangeId
      baseTokenBalance
    }
  }
`

export default function CollectTokens(): ReactElement {
  const { asset, error, owner, oceanConfig } = useAsset()
  const [isOwner, setIsOwner] = useState(false)
  const [baseTokenBalance, setBaseTokenBalance] = useState(0)
  const [isCollectLoading, setIsCollectLoading] = useState(false)
  // const [collectStatusText, setCollectStatusText] = useState('')

  const { accountId, web3 } = useWeb3()

  useEffect(() => {
    if (!asset || !accountId || error) {
      return
    }
    setIsOwner(owner === accountId)
  }, [asset, accountId, error])

  useEffect(() => {
    if (!accountId || !isOwner) return
    const queryContext = getQueryContext(Number(asset.chainId))

    async function getBaseTokenBalance() {
      const variables = {
        user: accountId.toLowerCase(),
        exchangeId: asset?.accessDetails?.addressOrId
      }
      const result: OperationResult<FixedRateExchanges> = await fetchData(
        FixedRateExchangesQuery,
        variables,
        queryContext
      )
      result?.data?.fixedRateExchanges[0]?.baseTokenBalance
        ? setBaseTokenBalance(
            parseInt(result?.data?.fixedRateExchanges[0]?.baseTokenBalance)
          )
        : setBaseTokenBalance(0)
    }
    getBaseTokenBalance()
  }, [accountId, asset?.accessDetails?.addressOrId, asset.chainId, asset.nft])

  async function handleCollectTokens() {
    if (baseTokenBalance === 0) return
    setIsCollectLoading(true)
    const fixed = new FixedRateExchange(
      web3,
      oceanConfig.fixedRateExchangeAddress
    )
    try {
      const tx = await fixed.collectBT(
        accountId,
        asset?.accessDetails?.addressOrId
      )
      if (!tx) {
        setIsCollectLoading(false)
        return
      }
      setBaseTokenBalance(0)
      return tx
    } catch (error) {
      LoggerInstance.log(error.message)
    } finally {
      setIsCollectLoading(false)
    }
  }

  return (
    asset &&
    isOwner &&
    baseTokenBalance > 0 &&
    (!isCollectLoading ? (
      <Button
        style="text"
        onClick={handleCollectTokens}
        className={styles.collectButton}
      >
        Collect {baseTokenBalance} {asset?.accessDetails?.baseToken.symbol}
        <Tooltip content="Collect the tokens that you earned by selling this asset" />
      </Button>
    ) : (
      <Loader message="Collecting tokens..." />
    ))
  )
}
