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

declare global {
  interface Window {
    startMigration: any
    completeMigration: any
  }
}

interface MigrationProviderValue {
  migrationAddress: string
  status: string
  poolV3Address: string
  poolV4Address: string
  didV3: string
  didV4: string
  owner: string
  poolShareOwners: string[]
  dtV3Address: string
  totalOcean: string
  totalDTBurnt: string
  newLPTAmount: string
  lptRounding: string
  deadline: string
  refreshMigrationStatus: () => Promise<void>
  thresholdMet: boolean
  deadlinePassed: boolean
  poolShares: string
  lockedSharesV3: string
  canAddShares: boolean
  addSharesToMigration: (amount: string) => Promise<TransactionReceipt>
  approveMigration: (amount: string) => Promise<TransactionReceipt>
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
  const [canAddShares, setCanAddShares] = useState<boolean>(false)

  const [status, setStatus] = useState<string>()
  const [poolV3Address, setPoolV3Address] = useState<string>()
  const [owner, setOwner] = useState<string>()
  const [dtV3Address, setDtV3Address] = useState<string>()
  const [totalOcean, setTotalOcean] = useState<string>()
  const [totalDTBurnt, setTotalDTBurnt] = useState<string>()
  const [deadline, setDeadline] = useState<string>()
  const [thresholdMet, setThresholdMet] = useState<boolean>()
  const [deadlinePassed, setDeadlinePassed] = useState<boolean>()
  const [poolShares, setpoolShares] = useState<string>()
  const [lockedSharesV3, setLockedSharesV3] = useState<string>()

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

  const startMigration = async (): Promise<void> => {
    if (
      migrationAddress &&
      status !== MigrationStatus.ALLOWED &&
      status !== MigrationStatus.COMPLETED &&
      ddo?.dataToken &&
      price?.address
    ) {
      const migration = new web3.eth.Contract(
        migrationAbi.abi as AbiItem[],
        migrationAddress
      )
      const estGas = await migration.methods
        .startMigration(ddo.dataToken, price.address)
        .estimateGas({ from: accountId })
      const tx = await migration.methods
        .startMigration(ddo.dataToken, price.address)
        .send({
          from: accountId,
          gas: estGas + 100000,
          gasPrice: await getFairGasPrice(web3)
        })
    }
  }

  const completeMigration = async (): Promise<void> => {
    if (migrationAddress && price?.address) {
      const migration = new web3.eth.Contract(
        migrationAbi.abi as AbiItem[],
        migrationAddress
      )
      const estGas = await migration.methods
        .liquidate(price.address, ['1', '1'])
        .estimateGas({ from: accountId })
      const tx = await migration.methods
        .liquidate(price.address, ['1', '1'])
        .send({
          from: accountId,
          gas: estGas + 100000,
          gasPrice: await getFairGasPrice(web3)
        })
    }
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

    const thresholdMet: boolean = await migration.methods
      .thresholdMet(price.address)
      .call()

    const canAddShares = await fetchCanAddShares(price.address)

    setCanAddShares(canAddShares)
    setStatus(poolStatus.status)
    setPoolV3Address(poolStatus.poolV3Address)
    setOwner(poolStatus.owner)
    setDtV3Address(poolStatus.dtV3Address)
    setTotalOcean(poolStatus.totalOcean)
    setTotalDTBurnt(poolStatus.totalDTBurnt)
    setDeadline(poolStatus.deadline)
    setThresholdMet(thresholdMet)
  }

  const refreshMigrationStatus = async () => {
    await loadMigrationInfo()
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

    window.startMigration = () => startMigration() // Todo: remove this when we are done with testing
    window.completeMigration = () => completeMigration() // Todo: remove this when we are done with testing
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
          migrationAddress,
          status,
          poolV3Address,
          owner,
          dtV3Address,
          totalOcean,
          totalDTBurnt,
          deadline,
          refreshMigrationStatus,
          thresholdMet,
          deadlinePassed,
          poolShares,
          lockedSharesV3,
          canAddShares,
          addSharesToMigration,
          approveMigration
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
