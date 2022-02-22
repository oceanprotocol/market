import { useFormikContext } from 'formik'
import React, { ReactElement, useEffect, useState } from 'react'
import { FormPublishData } from '../_types'
import { getFeesTokensAndPricing, getFeesPublishDDO } from '../_utils'
import { useWeb3 } from '@context/Web3'
import styles from './Feedback.module.css'
import TransactionCount from './TransactionCount'
import useNftFactory from '@hooks/contracts/useNftFactory'
import { NftFactory, LoggerInstance } from '@oceanprotocol/lib'
import { getOceanConfig } from '@utils/ocean'
import { usePrices } from '@context/Prices'

export function Feedback(): ReactElement {
  const { values } = useFormikContext<FormPublishData>()
  const nftFactory = useNftFactory()
  const [gasFeeToken, setGasFeeToken] = useState('')
  const [gasFeeDDO, setGasFeeDDO] = useState('')
  const { balance, web3, chainId } = useWeb3()
  const { prices } = usePrices()

  const getEstGasFeeToken = async (
    values: FormPublishData,
    accountId: string,
    nftFactory: NftFactory
  ): Promise<string> => {
    if (!nftFactory) return

    const config = getOceanConfig(chainId)
    LoggerInstance.log('[gas fee] using config: ', config)

    const result = await getFeesTokensAndPricing(
      values,
      accountId,
      config,
      nftFactory,
      web3,
      (prices as any)?.eth,
      balance.eth
    )

    LoggerInstance.log('[gas fee] createTokensAndPricing tx', result)

    return result
  }

  const getEstGasFeeDDO = async (
    values: FormPublishData,
    accountId: string
  ): Promise<string> => {
    if (!nftFactory) return

    const config = getOceanConfig(chainId)
    LoggerInstance.log('[gas fee] using config: ', config)

    const result = await getFeesPublishDDO(
      values,
      accountId,
      web3,
      (prices as any)?.eth,
      balance.eth
    )

    LoggerInstance.log('[gas fee] getFeesPublishDDO tx', result)

    return result
  }

  useEffect(() => {
    const calculateGasFeeToken = async () =>
      setGasFeeToken(
        await getEstGasFeeToken(values, values.user.accountId, nftFactory)
      )

    const calculateGasFeeDDO = async () =>
      setGasFeeDDO(await getEstGasFeeDDO(values, values.user.accountId))

    const { feedback } = values

    calculateGasFeeToken()
    calculateGasFeeDDO()
    let timer: number
    if (feedback['1'].status !== 'success') {
      timer = window.setInterval(() => {
        calculateGasFeeToken()
        calculateGasFeeDDO()
      }, 3000)
    }

    return () => {
      window.clearInterval(timer)
    }
  }, [values, nftFactory])

  const items = Object.entries(values.feedback).map(([key, value], index) => (
    <li key={index} className={styles[value.status]}>
      <h3 className={styles.title}>
        {value.name}
        {value.txCount > 0 && index === 0 && (
          <TransactionCount
            txCount={value.txCount}
            chainId={values.user.chainId}
            txHash={value.txHash}
            gasFees={gasFeeToken}
          />
        )}
        {value.txCount > 0 && index === 2 && (
          <TransactionCount
            txCount={value.txCount}
            chainId={values.user.chainId}
            txHash={value.txHash}
            gasFees={gasFeeDDO}
          />
        )}
      </h3>
      <p className={styles.description}>{value.description}</p>
      {value.errorMessage && (
        <span className={styles.errorMessage}>{value.errorMessage}</span>
      )}
    </li>
  ))

  return <ol className={styles.feedback}>{items}</ol>
}
