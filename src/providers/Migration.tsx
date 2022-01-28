import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  ReactNode,
  useCallback
} from 'react'
import Web3 from 'web3'
import {
  PoolStatus as MigrationPoolStatus,
  getPoolStatus
} from 'v4-migration-lib/' // currently using npm link

const MigrationContext = createContext({} as MigrationPoolStatus)

function MigrationProvider({
  asset,
  children
}: {
  asset: string | DDO
  children: ReactNode
}): ReactElement {
  async function fetchMigrationStatus() {
    const status = await getPoolStatus(migrationAddress, poolAddressV3)
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
