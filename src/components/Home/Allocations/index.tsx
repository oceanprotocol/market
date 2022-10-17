import React, { ReactElement, useEffect, useState } from 'react'
import { useWeb3 } from '@context/Web3'
import { AssetWithOwnAllocation, getOwnAllocations } from '@utils/veAllocation'
import styles from './index.module.css'
import {
  getFilterTerm,
  generateBaseQuery,
  queryMetadata
} from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
import { useCancelToken } from '@hooks/useCancelToken'
import { useIsMounted } from '@hooks/useIsMounted'
import { LoggerInstance } from '@oceanprotocol/lib'
import AssetListTable from './AssetListTable'

export default function Allocations(): ReactElement {
  const { accountId } = useWeb3()
  const { chainIds } = useUserPreferences()
  const isMounted = useIsMounted()
  const newCancelToken = useCancelToken()

  const [loading, setLoading] = useState<boolean>()
  const [data, setData] = useState<AssetWithOwnAllocation[]>()
  const [hasAllocations, setHasAllocations] = useState(false)

  useEffect(() => {
    if (!accountId) return

    async function checkAllocations() {
      try {
        const allocations = await getOwnAllocations(chainIds, accountId)
        setHasAllocations(allocations && allocations.length > 0)
      } catch (error) {
        LoggerInstance.error(error.message)
      }
    }
    checkAllocations()
  }, [accountId, chainIds])

  useEffect(() => {
    async function getAllocationAssets() {
      if (!hasAllocations) return

      try {
        setLoading(true)

        const allocations = await getOwnAllocations(chainIds, accountId)
        setHasAllocations(allocations && allocations.length > 0)

        const baseParams = {
          chainIds,
          filters: [
            getFilterTerm(
              'nftAddress',
              allocations.map((x) => x.nftAddress)
            )
          ],
          ignorePurgatory: true
        } as BaseQueryParams

        const query = generateBaseQuery(baseParams)

        const result = await queryMetadata(query, newCancelToken())

        const assetsWithAllocation: AssetWithOwnAllocation[] = []

        result?.results.forEach((asset) => {
          const allocation = allocations.find(
            (x) => x.nftAddress.toLowerCase() === asset.nftAddress.toLowerCase()
          )
          assetsWithAllocation.push({
            asset,
            allocation: `${allocation.allocation} %`
          })
        })

        if (!isMounted()) return
        setData(assetsWithAllocation)
        setLoading(false)
      } catch (error) {
        LoggerInstance.error(error.message)
      }
    }
    getAllocationAssets()
  }, [hasAllocations, accountId, chainIds, isMounted, newCancelToken])

  return (
    <section className={styles.section}>
      <h3>Your Allocated Assets</h3>
      <AssetListTable data={data} isLoading={loading} />
    </section>
  )
}
