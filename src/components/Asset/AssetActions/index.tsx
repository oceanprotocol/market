import React, { ReactElement, useState, useEffect } from 'react'
import Compute from './Compute'
import Consume from './Consume'
import { Logger } from '@oceanprotocol/lib'
import Tabs from '@shared/atoms/Tabs'
import { compareAsBN } from '@utils/numbers'
import Pool from './Pool'
import Trade from './Trade'
import { useAsset } from '@context/Asset'
import { useOcean } from '@context/Ocean'
import { useWeb3 } from '@context/Web3'
import Web3Feedback from '@shared/Web3Feedback'
import { FileMetadata, getFileInfo } from '@utils/provider'
import { getOceanConfig } from '@utils/ocean'
import { useCancelToken } from '@hooks/useCancelToken'
import { useIsMounted } from '@hooks/useIsMounted'
import styles from './index.module.css'

export default function AssetActions(): ReactElement {
  const { accountId, balance } = useWeb3()
  const { ocean, account } = useOcean()
  const { price, ddo, isAssetNetwork } = useAsset()

  const [isBalanceSufficient, setIsBalanceSufficient] = useState<boolean>()
  const [dtBalance, setDtBalance] = useState<string>()
  const [fileMetadata, setFileMetadata] = useState<FileMetadata>()
  const [fileIsLoading, setFileIsLoading] = useState<boolean>(false)
  const isCompute = Boolean(
    ddo?.services.filter((service) => service.type === 'compute')[0]
  )

  const [isConsumable, setIsConsumable] = useState<boolean>(true)
  const [consumableFeedback, setConsumableFeedback] = useState<string>('')
  const newCancelToken = useCancelToken()
  const isMounted = useIsMounted()

  // useEffect(() => {
  //   if (!ddo || !accountId || !ocean || !isAssetNetwork) return

  //   async function checkIsConsumable() {
  //     const consumable = await ocean.assets.isConsumable(
  //       ddo,
  //       accountId.toLowerCase()
  //     )
  //     if (consumable) {
  //       setIsConsumable(consumable.result)
  //       setConsumableFeedback(consumable.message)
  //     }
  //   }
  //   checkIsConsumable()
  // }, [accountId, isAssetNetwork, ddo, ocean])

  useEffect(() => {
    const oceanConfig = getOceanConfig(ddo.chainId)
    if (!oceanConfig) return

    async function initFileInfo() {
      setFileIsLoading(true)
      try {
        const fileInfoResponse = await getFileInfo(
          ddo.id,
          oceanConfig.providerUri,
          newCancelToken()
        )
        fileInfoResponse && setFileMetadata(fileInfoResponse[0])
        isMounted() && setFileIsLoading(false)
      } catch (error) {
        Logger.error(error.message)
      }
    }
    initFileInfo()
  }, [ddo, isMounted, newCancelToken])

  // Get and set user DT balance
  useEffect(() => {
    if (!ocean || !accountId || !isAssetNetwork) return
    async function init() {
      try {
        const dtBalance = await ocean.datatokens.balance(
          ddo.services[0].datatokenAddress,
          accountId
        )
        setDtBalance(dtBalance)
      } catch (e) {
        Logger.error(e.message)
      }
    }
    init()
  }, [ocean, accountId, ddo, isAssetNetwork])

  // Check user balance against price
  useEffect(() => {
    if (price?.type === 'free') setIsBalanceSufficient(true)
    if (!price?.value || !account || !balance?.ocean || !dtBalance) return

    setIsBalanceSufficient(
      compareAsBN(balance.ocean, `${price.value}`) || Number(dtBalance) >= 1
    )

    return () => {
      setIsBalanceSufficient(false)
    }
  }, [balance, account, price, dtBalance])

  const UseContent = isCompute ? (
    <Compute
      dtBalance={dtBalance}
      file={fileMetadata}
      fileIsLoading={fileIsLoading}
      isConsumable={isConsumable}
      consumableFeedback={consumableFeedback}
    />
  ) : (
    <Consume
      ddo={ddo}
      dtBalance={dtBalance}
      isBalanceSufficient={isBalanceSufficient}
      file={fileMetadata}
      fileIsLoading={fileIsLoading}
      isConsumable={isConsumable}
      consumableFeedback={consumableFeedback}
    />
  )

  const tabs = [
    {
      title: 'Use',
      content: UseContent
    }
  ]

  price?.type === 'pool' &&
    tabs.push(
      {
        title: 'Pool',
        content: <Pool />
      },
      {
        title: 'Trade',
        content: <Trade />
      }
    )

  return (
    <>
      <Tabs items={tabs} className={styles.actions} />
      <Web3Feedback isAssetNetwork={isAssetNetwork} />
    </>
  )
}
