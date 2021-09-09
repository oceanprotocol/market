import AccountTeaser from '../molecules/AccountTeaser'
import React, { useEffect, useState } from 'react'
import Pagination from '../molecules/Pagination'
import styles from './AssetList.module.css'
import classNames from 'classnames/bind'
import Loader from '../atoms/Loader'
import { useUserPreferences } from '../../providers/UserPreferences'
import { AccountSales } from '../../utils/subgraph'

const cx = classNames.bind(styles)

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

declare type AccountListProps = {
  accounts: AccountSales[]
  showPagination: boolean
  page?: number
  totalPages?: number
  isLoading?: boolean
  onPageChange?: React.Dispatch<React.SetStateAction<number>>
  className?: string
}

const AssetList: React.FC<AccountListProps> = ({
  accounts,
  showPagination,
  page,
  totalPages,
  isLoading,
  onPageChange,
  className
}) => {
  const { chainIds } = useUserPreferences()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!accounts) return
    isLoading && setLoading(true)
  }, [accounts])

  function handlePageChange(selected: number) {
    onPageChange(selected + 1)
  }

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
            // eslint-disable-next-line react/jsx-key
            <AccountTeaser account={account.publisher} large={false} />
          ))
        ) : chainIds.length === 0 ? (
          <div className={styles.empty}>No network selected.</div>
        ) : (
          <div className={styles.empty}>No results found.</div>
        )}
      </div>

      {showPagination && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onChangePage={handlePageChange}
        />
      )}
    </>
  ) : (
    <LoaderArea />
  )
}

export default AssetList
