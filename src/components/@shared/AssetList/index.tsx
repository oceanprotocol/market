import AssetTeaser from '@shared/AssetTeaser'
import React, { ReactElement, useEffect, useState } from 'react'
import { Asset, LoggerInstance } from '@oceanprotocol/lib'
import { CancelToken } from 'axios'
import Pagination from '@shared/Pagination'
import styles from './index.module.css'
import classNames from 'classnames/bind'
import Loader from '@shared/atoms/Loader'
import { useUserPreferences } from '@context/UserPreferences'
import { useIsMounted } from '@hooks/useIsMounted'
import { useWeb3 } from '@context/Web3'
import { retrieveAsset } from '@utils/aquarius'
import { getAccessDetailsForAssets } from '@utils/accessDetailsAndPricing'
import { useCancelToken } from '@hooks/useCancelToken'

const cx = classNames.bind(styles)

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

declare type AssetListProps = {
  assets: AssetExtended[]
  showPagination: boolean
  page?: number
  totalPages?: number
  isLoading?: boolean
  onPageChange?: React.Dispatch<React.SetStateAction<number>>
  className?: string
  noPublisher?: boolean
}

export default function AssetList({
  assets,
  showPagination,
  page,
  totalPages,
  isLoading,
  onPageChange,
  className,
  noPublisher
}: AssetListProps): ReactElement {
  const { chainIds } = useUserPreferences()
  const { accountId } = useWeb3()
  const [assetsWithPrices, setAssetsWithPrices] = useState<AssetExtended[]>()
  const [loading, setLoading] = useState<boolean>(isLoading)
  const isMounted = useIsMounted()
  const newCancelToken = useCancelToken()

  useEffect(() => {
    if (!assets) return

    setAssetsWithPrices(assets as AssetExtended[])
    setLoading(false)
    console.log('assets', assets)

    async function fetchPrices(token?: CancelToken) {
      const assetsWithPrices: Asset[] = []
      for (let i = 0; i < assets.length; i++) {
        const asseetWithPrice = await retrieveAsset(assets[i].id, token)
        assetsWithPrices.push(asseetWithPrice)
      }
      if (!isMounted() || !assetsWithPrices) return
      setAssetsWithPrices([...assetsWithPrices])
    }
    fetchPrices(newCancelToken())
  }, [assets, isMounted, accountId, newCancelToken])

  // // This changes the page field inside the query
  function handlePageChange(selected: number) {
    onPageChange(selected + 1)
  }

  const styleClasses = cx({
    assetList: true,
    [className]: className
  })
  console.log('assetsWithPrices', assetsWithPrices)

  return chainIds.length === 0 ? (
    <div className={styleClasses}>
      <div className={styles.empty}>No network selected</div>
    </div>
  ) : assetsWithPrices && !loading ? (
    <>
      <div className={styleClasses}>
        {assetsWithPrices.length > 0 ? (
          assetsWithPrices.map((assetWithPrice) => (
            <AssetTeaser
              asset={assetWithPrice}
              key={assetWithPrice.id}
              noPublisher={noPublisher}
            />
          ))
        ) : (
          <div className={styles.empty}>No results found</div>
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
