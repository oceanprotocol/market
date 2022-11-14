import AssetTeaser from '@shared/AssetTeaser'
import React, { ReactElement, useEffect, useState } from 'react'
import { Asset } from '@oceanprotocol/lib'
import { CancelToken } from 'axios'
import Pagination from '@shared/Pagination'
import styles from './index.module.css'
import Loader from '@shared/atoms/Loader'
import { useIsMounted } from '@hooks/useIsMounted'
import { useWeb3 } from '@context/Web3'
import { retrieveAsset } from '@utils/aquarius'
import { useCancelToken } from '@hooks/useCancelToken'

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

export declare type AssetListProps = {
  assets: AssetExtended[]
  showPagination: boolean
  page?: number
  totalPages?: number
  isLoading?: boolean
  onPageChange?: React.Dispatch<React.SetStateAction<number>>
  className?: string
  noPublisher?: boolean
  noDescription?: boolean
  noPrice?: boolean
}

export default function AssetList({
  assets,
  showPagination,
  page,
  totalPages,
  isLoading,
  onPageChange,
  className,
  noPublisher,
  noDescription,
  noPrice
}: AssetListProps): ReactElement {
  const { accountId } = useWeb3()
  const [assetsWithPrices, setAssetsWithPrices] =
    useState<AssetExtended[]>(assets)
  const [loading, setLoading] = useState<boolean>(isLoading)
  const isMounted = useIsMounted()
  const newCancelToken = useCancelToken()

  useEffect(() => {
    if (!assets || !assets.length) return

    setAssetsWithPrices(assets as AssetExtended[])
    setLoading(false)

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

  const styleClasses = `${styles.assetList} ${className || ''}`

  return loading ? (
    <LoaderArea />
  ) : (
    <>
      <div className={styleClasses}>
        {assetsWithPrices?.length > 0 ? (
          assetsWithPrices?.map((assetWithPrice) => (
            <AssetTeaser
              asset={assetWithPrice}
              key={assetWithPrice.id}
              noPublisher={noPublisher}
              noDescription={noDescription}
              noPrice={noPrice}
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
  )
}
