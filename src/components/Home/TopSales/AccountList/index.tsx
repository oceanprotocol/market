import React, { ReactElement } from 'react'
import styles from './index.module.css'
import Loader from '../../../@shared/atoms/Loader'
import { useUserPreferences } from '@context/UserPreferences'
import Account from '@components/Home/TopSales/Account'
import { UserSales } from '@utils/aquarius'

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

declare type AccountListProps = {
  accounts: UserSales[]
  isLoading: boolean
  className?: string
}

export default function AccountList({
  accounts,
  isLoading
}: AccountListProps): ReactElement {
  const { chainIds } = useUserPreferences()
  const emptyText =
    chainIds.length === 0 ? 'No network selected.' : 'No results found.'

  return isLoading ? (
    <LoaderArea />
  ) : (
    <div className={styles.list}>
      {accounts?.length > 0 ? (
        accounts.map((account, index) => (
          <Account account={account} key={index} place={index + 1} />
        ))
      ) : (
        <div className={styles.empty}>{emptyText}</div>
      )}
    </div>
  )
}
