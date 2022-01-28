import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  ReactNode,
  useCallback
} from 'react'
import { DDO, Logger } from '@oceanprotocol/lib'
import { PoolStatus as MigrationPoolStatus, Migration } from 'v4-migration-lib/' // currently using npm link
import appConfig from '../../app.config'
import { useWeb3 } from './Web3'
import { useAsset } from './Asset'

const MigrationContext = createContext({} as MigrationPoolStatus)
let migrationAddress: string

switch (chainId) {
  case 1:
    migrationAddress = appConfig.ethereumMigrationContractAddresss
    break
  case 137:
    migrationAddress = appConfig.polygonMigrationContractAddresss
    break
  case 56:
    migrationAddress = appConfig.bscMigrationContractAddresss
    break
  case 1285:
    migrationAddress = appConfig.moonriverMigrationContractAddresss
    break
  case 246:
    migrationAddress = appConfig.ewcMigrationContractAddresss
    break
  case 4:
    migrationAddress = appConfig.rinkebyMigrationContractAddresss
    break
  default:
    break
}

function MigrationProvider({
  asset,
  children
}: {
  asset: string | DDO
  children: ReactNode
}): ReactElement {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const { chainId } = useWeb3()
  const { ddo } = useAsset()
  const { web3 } = useWeb3()
  const migration = new Migration(web3)

  async function fetchMigrationStatus(poolAddressV3: string) {
    Logger.log('Fetching migration status')
    setLoading(true)
    const status = await migration.getPoolStatus(
      migrationAddress,
      poolAddressV3
    )
    if (!status) {
      setError(
        `No migration status was found for asset with poolAddress ${poolAddressV3} on network with chainId ${chainId} in migration contract with address ${migrationAddress}`
      )
    } else {
      setError(undefined)
    }
    setLoading(false)
  }

  return (
    <MigrationContext.Provider
      value={{
        migrationStatus
      }}
    >
      {children}
    </MigrationContext.Provider>
  )
}
// Helper hook to access the provider values
const useMigrationStatus = (): MigrationPoolStatus =>
  useContext(MigrationContext)

export {
  MigrationProvider,
  useMigrationStatus,
  MigrationPoolStatus,
  MigrationContext
}
export default MigrationProvider
