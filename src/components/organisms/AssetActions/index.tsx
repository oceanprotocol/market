import React, { ReactElement, useState, useEffect } from 'react'
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
import { getFileInfo } from '../../../utils/provider'
import axios from 'axios'
import { initialValues } from '../../../models/FormTrade'

export default function AssetActions(): ReactElement {
  const { accountId } = useWeb3()
  const { config, ocean, balance, account } = useOcean()
  const { price, ddo } = useAsset()

  const [isBalanceSufficient, setIsBalanceSufficient] = useState<boolean>()
  const [dtBalance, setDtBalance] = useState<string>()
  const [fileMetadata, setFileMetadata] = useState<FileMetadata>()
  const isCompute = Boolean(ddo?.findServiceByType('compute'))

  // Get and set user DT balance

  useEffect(() => {
    if (!config) return
    const source = axios.CancelToken.source()
    async function initFileInfo() {
      try {
        const fileInfo = await getFileInfo(
          DID.parse(`${ddo.id}`),
          config.providerUri,
          source.token
        )
        setFileMetadata(fileInfo.data[0])
      } catch (error) {
        Logger.error(error.message)
      }
    }
    initFileInfo()
  }, [config, ddo])

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
    />
  ) : (
    <Consume
      ddo={ddo}
      dtBalance={dtBalance}
      isBalanceSufficient={isBalanceSufficient}
      file={fileMetadata}
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

  return <Tabs items={tabs} className={styles.actions} />
}
