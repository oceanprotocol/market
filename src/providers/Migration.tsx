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

interface MigrationStatusProvider {
  migrationAddress: string
  status: number
  poolV3Address: string
  poolV4Address: string
  didV3: string
  didV4: string
  owner: string
  poolShareOwners: string[]
  dtV3Address: string
  totalOcean: number
  totalDTBurnt: number
  newLPTAmount: number
  lptRounding: number
  deadline: number
}

const MigrationContext = createContext({} as MigrationStatusProvider)

function MigrationProvider({
  asset,
  children
}: {
  asset: string | DDO
  children: ReactNode
}): ReactElement {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [migrationAddress, setMigrationAddress] = useState<string>()
  const [status, setStatus] = useState<number>()
  const [poolV3Address, setPoolV3Address] = useState<string>()
  const [poolV4Address, setPoolV4Address] = useState<string>()
  const [didV3, setDidV3] = useState<string>()
  const [didV4, setDidV4] = useState<string>()
  const [owner, setOwner] = useState<string>()
  const [poolShareOwners, setPoolShareOwners] = useState<string[]>()
  const [dtV3Address, setDtV3Address] = useState<string>()
  const [totalOcean, setTotalOcean] = useState<number>()
  const [totalDTBurnt, setTotalDTBurnt] = useState<number>()
  const [newLPTAmount, setNewLPTAmount] = useState<number>()
  const [lptRounding, setLptRounding] = useState<number>()
  const [deadline, setDeadline] = useState<number>()
  const { chainId } = useWeb3()
  const { ddo } = useAsset()
  const { web3 } = useWeb3()

  async function switchMigrationAddress(chainId: number): Promise<void> {
    switch (chainId) {
      case 1:
        setMigrationAddress(appConfig.ethereumMigrationContractAddresss)
        break
      case 137:
        setMigrationAddress(appConfig.polygonMigrationContractAddresss)
        break
      case 56:
        setMigrationAddress(appConfig.bscMigrationContractAddresss)
        break
      case 1285:
        setMigrationAddress(appConfig.moonriverMigrationContractAddresss)
        break
      case 246:
        setMigrationAddress(appConfig.ewcMigrationContractAddresss)
        break
      case 4:
        setMigrationAddress(appConfig.rinkebyMigrationContractAddresss)
        break
      default:
        break
    }
  }

  async function fetchMigrationStatus(
    poolAddressV3: string,
    migrationAddress: string
  ): Promise<MigrationPoolStatus> {
    Logger.log('Fetching migration status')
    setLoading(true)
    const migration = new Migration(web3)
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
    return status
  }

  //
  // Get and set Migration status based on passed DDO
  //
  useEffect(() => {
    if (!ddo) return

    async function init() {
      await switchMigrationAddress(chainId)
      const status = await fetchMigrationStatus(
        ddo.price.pools[0],
        migrationAddress
      )
      Logger.debug('[Migration] Got Migration Pool Status', status)
      setStatus(status.status)
      setPoolV3Address(status.poolV3Address)
      setPoolV4Address(status.poolV4Address)
      setDidV3(status.didV3)
      setDidV4(status.didV4)
      setOwner(status.owner)
      setPoolShareOwners(status.poolShareOwners)
      setDtV3Address(status.dtV3Address)
      setTotalOcean(status.totalOcean)
      setTotalDTBurnt(status.totalDTBurnt)
      setNewLPTAmount(status.newLPTAmount)
      setLptRounding(status.lptRounding)
      setDeadline(status.deadline)
    }
    init()
  }, [ddo, chainId])

  return (
    <MigrationContext.Provider
      value={{
        migrationAddress,
        status,
        poolV3Address,
        poolV4Address,
        didV3,
        didV4,
        owner,
        poolShareOwners,
        dtV3Address,
        totalOcean,
        totalDTBurnt,
        newLPTAmount,
        lptRounding,
        deadline
      }}
    >
      {children}
    </MigrationContext.Provider>
  )
}
// Helper hook to access the provider values
const useMigrationStatus = (): MigrationStatusProvider =>
  useContext(MigrationContext)

export {
  MigrationProvider,
  useMigrationStatus,
  MigrationPoolStatus,
  MigrationContext
}
export default MigrationProvider
