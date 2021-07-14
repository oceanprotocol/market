import React, { ReactElement, useState, useEffect } from 'react'
import Permission from '../Permission'
import styles from './index.module.css'
import Compute from './Compute'
import Consume from './Consume'
import { Logger, File as FileMetadata, DID } from '@oceanprotocol/lib'
import Tabs from '../../atoms/Tabs'
import compareAsBN from '../../../utils/compareAsBN'
import Pool from './Pool'
import Trade from './Trade'
import { useAsset } from '../../../providers/Asset'
import { useOcean } from '../../../providers/Ocean'
import { useWeb3 } from '../../../providers/Web3'
import Web3Feedback from '../../molecules/Web3Feedback'
import { getFileInfo } from '../../../utils/provider'
import axios from 'axios'

export default function AssetActions(): ReactElement {
  const { accountId, balance } = useWeb3()
  const { ocean, config, account } = useOcean()
  const { price, ddo, metadata, type, isAssetNetwork } = useAsset()

  const [isBalanceSufficient, setIsBalanceSufficient] = useState<boolean>()
  const [dtBalance, setDtBalance] = useState<string>()
  const [fileMetadata, setFileMetadata] = useState<FileMetadata>(Object)
  const [fileIsLoading, setFileIsLoading] = useState<boolean>(false)
  const isCompute = Boolean(ddo?.findServiceByType('compute'))

  const [isConsumable, setIsConsumable] = useState<boolean>(true)
  const [consumableFeedback, setConsumableFeedback] = useState<string>('')

  useEffect(() => {
    if (!ddo || !accountId) return
    async function checkIsConsumable() {
      const consumable: any = await ocean.assets.isConsumable(
        ddo,
        accountId.toLowerCase()
      )
      if (consumable) {
        setIsConsumable(consumable.result)
        setConsumableFeedback(consumable.message)
      }
    }
    checkIsConsumable()
  }, [accountId, ddo])

  useEffect(() => {
    if (!config) return
    const source = axios.CancelToken.source()
    async function initFileInfo() {
      setFileIsLoading(true)
      try {
        const fileInfo = await getFileInfo(
          DID.parse(`${ddo.id}`),
          config.providerUri,
          source.token
        )

        setFileMetadata(fileInfo.data[0])
      } catch (error) {
        Logger.error(error.message)
      } finally {
        // this triggers a memory leak warrning, no idea how to fix
        setFileIsLoading(false)
      }
    }
    initFileInfo()
    return () => {
      source.cancel()
    }
  }, [config, ddo])

  // Get and set user DT balance
  useEffect(() => {
    if (!ocean || !accountId) return

    async function init() {
      try {
        const dtBalance = await ocean.datatokens.balance(
          ddo.dataToken,
          accountId
        )
        setDtBalance(dtBalance)
      } catch (e) {
        Logger.error(e.message)
      }
    }
    init()
  }, [ocean, accountId, ddo.dataToken])

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
      isBalanceSufficient={isBalanceSufficient}
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
      <Permission eventType="consume">
        <Tabs items={tabs} className={styles.actions} />
      </Permission>
      {type !== 'algorithm' && (
        <Web3Feedback
          isBalanceSufficient={isBalanceSufficient}
          isAssetNetwork={isAssetNetwork}
        />
      )}
    </>
  )
}
