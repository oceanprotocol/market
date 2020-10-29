import { useMetadata, useOcean } from '@oceanprotocol/react'
import { Link } from 'gatsby'
import React, { ReactElement, useEffect, useState } from 'react'
import Dotdotdot from 'react-dotdotdot'
import Table from '../../atoms/Table'
import { DDO, Logger, MetadataCache } from '@oceanprotocol/lib'

function AssetTitle({ did }: { did: string }): ReactElement {
  const { title } = useMetadata(did)
  return (
    <Dotdotdot clamp={2}>
      <Link to={`/asset/${did}`}>{title || did}</Link>
    </Dotdotdot>
  )
}

const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: DDO) {
      const did = row.id
      return <AssetTitle did={did} />
    }
  }
]

export default function PoolShares(): ReactElement {
  const { ocean, accountId, config } = useOcean()
  const [assets, setAssets] = useState<DDO[]>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function getAssets() {
      if (!ocean || !accountId) return
      setIsLoading(true)

      try {
        const pools = await ocean.pool.getPoolSharesByAddress(accountId)
        const metadataCache = new MetadataCache(config.metadataCacheUri, Logger)
        const result: DDO[] = []

        for (const pool of pools) {
          const ddo = await metadataCache.retrieveDDO(pool)
          ddo && result.push(ddo)
        }

        setAssets(result)
      } catch (error) {
        Logger.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    getAssets()
  }, [ocean, accountId, config.metadataCacheUri])

  return <Table columns={columns} data={assets} isLoading={isLoading} />
}
