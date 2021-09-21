import { Logger, Ocean } from '@oceanprotocol/lib'
import { TransactionReceipt } from 'web3-core'

export async function setMinterToPublisher(
  ocean: Ocean,
  dataTokenAddress: string,
  accountId: string,
  setError: (msg: string) => void
): Promise<TransactionReceipt | boolean> {
  // free pricing v3 workaround part1
  const status = await ocean.OceanDispenser.status(dataTokenAddress)
  if (!status?.minterApproved) return true

  const response = await ocean.OceanDispenser.cancelMinter(
    dataTokenAddress,
    accountId
  )
  if (!response) {
    setError('Updating DDO failed.')
    Logger.error('Failed at cancelMinter')
  }
  return response
}

export async function setMinterToDispenser(
  ocean: Ocean,
  dataTokenAddress: string,
  accountId: string,
  setError: (msg: string) => void
): Promise<TransactionReceipt> {
  // free pricing v3 workaround part2
  const response = await ocean.OceanDispenser.makeMinter(
    dataTokenAddress,
    accountId
  )
  if (!response) {
    setError('Updating DDO failed.')
    Logger.error('Failed at makeMinter')
  }
  return response
}
