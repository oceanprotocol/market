import { Logger } from '@oceanprotocol/lib'
import BigNumber from 'bignumber.js'
import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { OperationResult } from 'urql'
import Web3 from 'web3'
import { TransactionReceipt } from 'web3-core'
import { AbiItem } from 'web3-utils'
import appConfig from '../../../app.config'
import { PoolLiquidity } from '../../@types/apollo/PoolLiquidity'
import { userPoolShareQuery } from '../../components/organisms/AssetActions/Pool'
import { fetchData, getQueryContext } from '../../utils/subgraph'
import { useAsset } from '../Asset'
import { useWeb3 } from '../Web3'
import erc20Abi from './erc20.json'
import migrationAbi from './migration.json'

interface MigrationProviderValue {
  canAddShares: boolean
  deadlinePassed: boolean
  poolShares: string
  lockedSharesV3: string
  addSharesToMigration: (amount: string) => Promise<TransactionReceipt>
  approveMigration: (amount: string) => Promise<TransactionReceipt>
  refreshMigrationStatus: () => Promise<void>
}

export enum MigrationStatus {
  NOT_STARTED = '0',
  ALLOWED = '1',
  COMPLETED = '2'
}

const MigrationContext = createContext({} as MigrationProviderValue)

function MigrationProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const { chainId, accountId, web3 } = useWeb3()
  const { price, ddo } = useAsset()
  const [migrationAddress, setMigrationAddress] = useState<string>()
  const [poolV3Address, setPoolV3Address] = useState<string>()
  const [deadline, setDeadline] = useState<string>()
  const [deadlinePassed, setDeadlinePassed] = useState<boolean>()
  const [poolShares, setpoolShares] = useState<string>()
  const [lockedSharesV3, setLockedSharesV3] = useState<string>()
  const [canAddShares, setCanAddShares] = useState<boolean>(false)

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

  async function fetchCanAddShares(poolAddress: string): Promise<boolean> {
    const migration = new web3.eth.Contract(
      migrationAbi.abi as AbiItem[],
      migrationAddress
    )
    return migration.methods.canAddShares(poolAddress).call()
  }

  interface PoolStatus {
    status: MigrationStatus
    poolV3Address: string
    dtV3Address: string
    owner: string
    poolShares: { owner: string; shares: string }[]
    lps: string
    totalSharesLocked: string
    totalOcean: string
    totalDTBurnt: string
    deadline: string
  }

  async function getFairGasPrice(web3: Web3): Promise<string> {
    const x = new BigNumber(await web3.eth.getGasPrice())
    return x.multipliedBy(1.05).integerValue(BigNumber.ROUND_DOWN).toString(10)
  }

  async function getUserPoolShareBalance() {
    const queryContext = getQueryContext(chainId)
    const queryVariables = {
      id: price.address.toLowerCase(),
      shareId: `${price.address.toLowerCase()}-${accountId.toLowerCase()}`
    }

    const queryResult: OperationResult<PoolLiquidity> = await fetchData(
      userPoolShareQuery,
      queryVariables,
      queryContext
    )
    return queryResult?.data.pool.shares[0]?.balance
  }

  async function fetchUserLockedSharesForMigration(
    poolAddressV3: string,
    migrationAddress: string
  ): Promise<string> {
    const migration = new web3.eth.Contract(
      migrationAbi.abi as AbiItem[],
      migrationAddress
    )
    return migration.methods
      .getPoolSharesforUser(poolAddressV3, accountId)
      .call()
  }

  async function approveMigration(amount: string): Promise<TransactionReceipt> {
    try {
      const erc20Contract = new web3.eth.Contract(
        erc20Abi.abi as AbiItem[],
        poolV3Address
      )

      const estGas = await erc20Contract.methods
        .approve(migrationAddress, web3.utils.toWei(amount))
        .estimateGas({ from: accountId })

      const trxReceipt = await erc20Contract.methods
        .approve(migrationAddress, web3.utils.toWei(amount))
        .send({
          from: accountId,
          gas: estGas + 100000,
          gasPrice: await getFairGasPrice(web3)
        })
      return trxReceipt
    } catch (error) {
      console.log('error', error)
    }
  }

  async function addSharesToMigration(
    amount: string
  ): Promise<TransactionReceipt> {
    const migration = new web3.eth.Contract(
      migrationAbi.abi as AbiItem[],
      migrationAddress
    )

    const estGas = await migration.methods
      .addShares(poolV3Address, web3.utils.toWei(amount))
      .estimateGas({ from: accountId })

    const tx = await migration.methods
      .addShares(poolV3Address, web3.utils.toWei(amount))
      .send({
        from: accountId,
        gas: estGas + 100000,
        gasPrice: await getFairGasPrice(web3)
      })

    return tx
  }

  async function loadMigrationInfo(): Promise<void> {
    const migration = new web3.eth.Contract(
      migrationAbi.abi as AbiItem[],
      migrationAddress
    )

    const poolStatus: PoolStatus = await migration.methods
      .getPoolStatus(price.address)
      .call()
    const canAddShares = await fetchCanAddShares(price.address)

    setCanAddShares(canAddShares)
    setPoolV3Address(poolStatus.poolV3Address)
    setDeadline(poolStatus.deadline)
  }

  const refreshMigrationStatus = async () => {
    await loadMigrationInfo()
    await fetchUserLockedSharesForMigration(
      price.address,
      migrationAddress
    ).then(setLockedSharesV3)
    await getUserPoolShareBalance().then(setpoolShares)
  }

  useEffect(() => {
    switchMigrationAddress(chainId)
  }, [chainId])

  useEffect(() => {
    if (migrationAddress && price?.address) {
      loadMigrationInfo()
    }
  }, [migrationAddress, price])

  useEffect(() => {
    web3 &&
      web3.eth
        .getBlockNumber()
        .then((currentBlock) =>
          setDeadlinePassed(currentBlock > parseInt(deadline))
        )
  }, [deadline])

  useEffect(() => {
    if (!accountId || !price?.address) return
    getUserPoolShareBalance()
      .then(setpoolShares)
      .catch((error) => Logger.error(error.message))
  }, [accountId, price, deadline])

  useEffect(() => {
    if (!(price?.address && accountId && migrationAddress && web3)) return
    fetchUserLockedSharesForMigration(price.address, migrationAddress)
      .then(setLockedSharesV3)
      .catch((error) => Logger.error(error.message))
  }, [price, accountId, migrationAddress, web3, deadline])

  return (
    <MigrationContext.Provider
      value={
        {
          canAddShares,
          deadlinePassed,
          poolShares,
          lockedSharesV3,
          addSharesToMigration,
          approveMigration,
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
