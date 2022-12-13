import { useUserPreferences } from '@context/UserPreferences'
import { LoggerInstance } from '@oceanprotocol/lib'
import AccountList from '@components/Home/TopSales/AccountList'
import { getTopAssetsPublishers, UserSales } from '@utils/aquarius'
import React, { ReactElement, useEffect, useState } from 'react'
import styles from './index.module.css'

export default function TopSales({
  title,
  action
}: {
  title: ReactElement | string
  action?: ReactElement
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const [result, setResult] = useState<UserSales[]>([])
  const [loading, setLoading] = useState<boolean>()

  useEffect(() => {
    async function init() {
      setLoading(true)
      if (chainIds.length === 0) {
        const result: UserSales[] = []
        setResult(result)
        setLoading(false)
      } else {
        try {
          const publishers = await getTopAssetsPublishers(chainIds)
          setResult(publishers)
          setLoading(false)
        } catch (error) {
          LoggerInstance.error(error.message)
          setLoading(false)
        }
      }
    }
    init()
  }, [chainIds])

  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      <AccountList accounts={result} isLoading={loading} />
      {action && action}
    </section>
  )
}
