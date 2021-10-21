import AccountTeaser from '../molecules/AccountTeaser'
import React, { useEffect, useState } from 'react'
import styles from './AssetList.module.css'
import classNames from 'classnames/bind'
import Loader from '../atoms/Loader'
import { useUserPreferences } from '../../providers/UserPreferences'

const cx = classNames.bind(styles)

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

declare type AccountListProps = {
  accounts: string[]
  isLoading?: boolean
  className?: string
}

const AccountList: React.FC<AccountListProps> = ({
  accounts,
  isLoading,
  className
}) => {
  const { chainIds } = useUserPreferences()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    isLoading && setLoading(true)
    if (!accounts) return
    setLoading(false)
  }, [accounts])

  const styleClasses = cx({
    assetList: true,
    [className]: className
  })

  return accounts &&
    !loading &&
    (isLoading === undefined || isLoading === false) ? (
    <>
      <div className={styleClasses}>
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <AccountTeaser account={account} key={account} />
          ))
        ) : chainIds.length === 0 ? (
          <div className={styles.empty}>No network selected.</div>
        ) : (
          <div className={styles.empty}>No results found.</div>
        )}
      </div>
    </>
  ) : (
    <LoaderArea />
  )
}

export default AccountList
