import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import FormTrade from './FormTrade'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import Decimal from 'decimal.js'
import { Datatoken, LoggerInstance, Pool } from '@oceanprotocol/lib'
import { getPoolData } from '@utils/subgraph'
import { PoolData_poolData as PoolDataPoolData } from 'src/@types/subgraph/PoolData'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

interface PoolInfo {
  poolFee: string
  weightBaseToken?: string
  weightDt?: string
  datatokenSymbol: string
  datatokenAddress: string
  baseTokenSymbol: string
  baseTokenAddress: string
  totalPoolTokens: string
  totalLiquidityInOcean: Decimal
}

export default function Trade(): ReactElement {
  const { accountId, balance, web3 } = useWeb3()
  const { isAssetNetwork } = useAsset()
  const [tokenBalance, setTokenBalance] = useState<PoolBalance>()
  const { asset } = useAsset()
  const [maxDt, setMaxDt] = useState('0')
  const [maxBaseToken, setMaxBaseToken] = useState('0')

  const fetchPoolData = useCallback(async () => {
    if (!ddo?.chainId || !price?.address || !owner) return

    const response = await getPoolData(
      ddo.chainId,
      price.address,
      owner,
      accountId || ''
    )
    if (!response) return

    setPoolData(response.poolData)
  }, [ddo?.chainId, price?.address, owner, accountId])

  const initFetchInterval = useCallback(() => {
    if (fetchInterval) return

    const newInterval = setInterval(() => {
      fetchPoolData()
      LoggerInstance.log(
        `[pool] Refetch interval fired after ${refreshInterval / 1000}s`
      )
    }, refreshInterval)
    setFetchInterval(newInterval)
  }, [fetchInterval, fetchPoolData, refreshInterval])

  useEffect(() => {
    return () => {
      clearInterval(fetchInterval)
    }
  }, [fetchInterval])

  useEffect(() => {
    fetchPoolData()
    initFetchInterval()
  }, [fetchPoolData, initFetchInterval])

  useEffect(() => {
    if (!poolData || !price?.ocean || !price?.datatoken) return

    // Pool Fee (swap fee)
    // poolFee is tricky: to get 0.1% you need to convert from 0.001
    const poolFee = isValidNumber(poolData.poolFee)
      ? new Decimal(poolData.poolFee).mul(100).toString()
      : '0'

    // Total Liquidity
    const totalLiquidityInOcean =
      isValidNumber(price.ocean) &&
      isValidNumber(price.datatoken) &&
      isValidNumber(poolData.spotPrice)
        ? new Decimal(price.ocean).add(
            new Decimal(price.datatoken).mul(poolData.spotPrice)
          )
        : new Decimal(0)

    const newPoolInfo = {
      poolFee,
      datatokenAddress: poolData.datatoken.address,
      datatokenSymbol: poolData.datatoken.symbol,
      baseTokenSymbol: poolData.baseToken.symbol,
      baseTokenAddress: poolData.baseToken.address,
      totalPoolTokens: poolData.totalShares,
      totalLiquidityInOcean
    }
    setPoolInfo(newPoolInfo)
    LoggerInstance.log('[pool] Created new pool info:', newPoolInfo)
  }, [poolData, price?.datatoken, price?.ocean])

  // Get datatoken balance, and combine with OCEAN balance from hooks into one object
  useEffect(() => {
    if (
      !web3 ||
      !accountId ||
      !isAssetNetwork ||
      !balance?.ocean ||
      !accountId ||
      !asset?.services[0].datatokenAddress
    )
      return

    async function getTokenBalance() {
      const datatokenInstance = new Datatoken(web3)
      const dtBalance = await datatokenInstance.balance(
        asset.services[0].datatokenAddress,
        accountId
      )
      setTokenBalance({
        baseToken: new Decimal(balance.ocean).toString(),
        datatoken: new Decimal(dtBalance).toString()
      })
    }
    getTokenBalance()
  }, [web3, balance.ocean, accountId, asset, isAssetNetwork])

  // Get maximum amount for either OCEAN or datatoken
  useEffect(() => {
    if (
      !isAssetNetwork ||
      !asset.accessDetails ||
      asset.accessDetails.price === 0
    )
      return

    async function getMaximum() {
      try {
        const poolInstance = new Pool(web3, LoggerInstance)

        const maxTokensInPool = await poolInstance.getReserve(
          price.address,
          poolInfo.datatokenAddress
        )
        setMaxDt(
          isValidNumber(maxTokensInPool)
            ? new Decimal(maxTokensInPool).toString()
            : '0'
        )
        const maxBaseTokenInPool = await poolInstance.getReserve(
          price.address,
          poolInfo.baseTokenAddress
        )
        setMaxBaseToken(
          isValidNumber(maxBaseTokenInPool)
            ? new Decimal(maxBaseTokenInPool).toString()
            : '0'
        )
      } catch (error) {
        LoggerInstance.log(error.message)
      }
    }
    getMaximum()
  }, [isAssetNetwork, balance.ocean, asset])

  return (
    <FormTrade
      asset={asset}
      balance={tokenBalance}
      maxDt={maxDt}
      maxBaseToken={maxBaseToken}
    />
  )
}
