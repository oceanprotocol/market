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
import Web3Modal, { getProviderInfo, IProviderInfo } from 'web3modal'
import { infuraProjectId as infuraId, portisId } from '../../app.config'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { Logger } from '@oceanprotocol/lib'
import { isBrowser } from '../utils'
import {
  EthereumListsChain,
  getNetworkDataById,
  getNetworkDisplayName,
  getNetworkType,
  NetworkType
} from '../utils/web3'
import { getEnsName } from '../utils/ens'
import { UserBalance } from '../@types/TokenBalance'
import { getOceanBalance } from '../utils/ocean'
import useNetworkMetadata from '../hooks/useNetworkMetadata'
import { PoolStatus as MigrationPoolStatus } from 'v4-migration-lib/' // currently using npm link

// interface MigrationPoolStatus {
//     migrationStatus status;
//     address poolV3Address;
//     address poolV4Address;
//     string didV3;
//     string didV4;
//     address owner;
//     address[] poolShareOwners;
//     address dtV3Address;
//     uint256 totalOcean;
//     uint256 totalDTBurnt;
//     uint256 newLPTAmount;
//     uint256 lptRounding;
//     uint256 deadline;
// }

const MigrationContext = createContext({} as MigrationPoolStatus)

function MigrationProvider({
  asset,
  children
}: {
  asset: string | DDO
  children: ReactNode
}): ReactElement {
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
