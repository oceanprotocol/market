import React, { ReactElement } from 'react'
import styles from './index.module.css'
import classNames from 'classnames/bind'
import Loader from '../atoms/Loader'
import { useUserPreferences } from '@context/UserPreferences'
import AccountTeaser from '@shared/AccountTeaser/AccountTeaser'

const cx = classNames.bind(styles)

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

declare type AccountListProps = {
  accounts: AccountTeaserVM[]
  isLoading: boolean
  className?: string
}

export default function AccountList({
  accounts,
  isLoading,
  className
}: AccountListProps): ReactElement {
  const { chainIds } = useUserPreferences()

  const styleClasses = cx({
    accountList: true,
    [className]: className
  })

  return accounts && (isLoading === undefined || isLoading === false) ? (
    <>
      <div className={styleClasses}>
        {accounts.length > 0 ? (
          accounts.map((account, index) => (
            <AccountTeaser
              accountTeaserVM={account}
              key={index + 1}
              place={index + 1}
            />
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
