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
Logger.log('Migration provider called')

interface MigrationProviderValue {
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
  refreshMigrationStatus: (
    poolAddressV3: string,
    migrationAddress: string
  ) => Promise<void>
}

const MigrationContext = createContext({} as MigrationProviderValue)

function MigrationProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [migrationAddress, setMigrationAddress] = useState<string>()
  const [status, setStatus] = useState<number>()
  const [poolV3Address, setPoolV3Address] = useState<string>('TEST')
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
  Logger.log('chainId', chainId)
  async function switchMigrationAddress(chainId: number): Promise<void> {
    Logger.log('switchMigrationAddress', migrationAddress)
    switch (chainId) {
      case 1:
        setMigrationAddress(appConfig.ethereumMigrationContractAddresss)
        Logger.log('switchMigrationAddress', migrationAddress)
        break
      case 137:
        setMigrationAddress(appConfig.polygonMigrationContractAddresss)
        Logger.log('switchMigrationAddress', migrationAddress)
        break
      case 56:
        setMigrationAddress(appConfig.bscMigrationContractAddresss)
        Logger.log('switchMigrationAddress', migrationAddress)
        break
      case 1285:
        setMigrationAddress(appConfig.moonriverMigrationContractAddresss)
        Logger.log('switchMigrationAddress', migrationAddress)
        break
      case 246:
        setMigrationAddress(appConfig.ewcMigrationContractAddresss)
        Logger.log('switchMigrationAddress', migrationAddress)
        break
      case 4:
        setMigrationAddress(appConfig.rinkebyMigrationContractAddresss)
        Logger.log('switchMigrationAddress', migrationAddress)
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

  const refreshMigrationStatus = async (
    poolAddressV3: string,
    migrationAddress: string
  ) => {
    setLoading(true)
    const status = await fetchMigrationStatus(poolAddressV3, migrationAddress)
    Logger.debug('[migration] Got Migration Status', status.status)
    setStatus(status.status)
    setLoading(false)
  }

  //
  // Get and set Migration status based on passed DDO
  //
  Logger.log('fetchMigrationStatus 1', migrationAddress)

  // const initMigrationStatus = useCallback(async (ddo: DDO): Promise<void> => {
  //   if (!ddo) return
  //   setLoading(true)
  //   const returnedPrice = await getPrice(ddo)
  //   setPrice({ ...returnedPrice })

  //   // Get metadata from DDO
  //   const { attributes } = ddo.findServiceByType('metadata')
  //   setMetadata(attributes as unknown as MetadataMarket)
  //   setTitle(attributes?.main.name)
  //   setType(attributes.main.type)
  //   setOwner(ddo.publicKey[0].owner)
  //   Logger.log('[asset] Got Metadata from DDO', attributes)

  //   setIsInPurgatory(ddo.isInPurgatory === 'true')
  //   await setPurgatory(ddo.id)
  //   setLoading(false)
  // }, [])

  useEffect(() => {
    Logger.log('fetchMigrationStatus 2', migrationAddress)

    async function init() {
      Logger.log('fetchMigrationStatus 3', migrationAddress)
      await switchMigrationAddress(chainId)
      Logger.log('fetchMigrationStatus 4', migrationAddress)
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
    Logger.log('fetchMigrationStatus 5', migrationAddress)
    init()
  }, [chainId])
  Logger.log('fetchMigrationStatus 6', migrationAddress)
  return (
    <MigrationContext.Provider
      value={
        {
          migrationAddress: 'test123',
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
          deadline,
          refreshMigrationStatus
        } as MigrationProviderValue
      }
    >
      {children}
    </MigrationContext.Provider>
  )
}
// Helper hook to access the provider values
const useMigrationStatus = (): MigrationProviderValue =>
  useContext(MigrationContext)

export {
  MigrationProvider,
  useMigrationStatus,
  MigrationProviderValue,
  MigrationContext
}
export default MigrationProvider
