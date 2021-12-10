import { LoggerInstance } from '@oceanprotocol/lib'
import { TransactionReceipt } from 'web3-core'

export async function setMinterToPublisher(
  dataTokenAddress: string,
  accountId: string,
  setError: (msg: string) => void
): Promise<TransactionReceipt> {
  // free pricing v3 workaround part1
  // const status = await ocean.OceanDispenser.status(dataTokenAddress)
  // if (!status?.minterApproved) return
  // const response = await ocean.OceanDispenser.cancelMinter(
  //   dataTokenAddress,
  //   accountId
  // )
  // if (!response) {
  //   setError('Updating DDO failed.')
  //   LoggerInstance.error('Failed at cancelMinter')
  // }
  // return response
  return null
}

export async function setMinterToDispenser(
  dataTokenAddress: string,
  accountId: string,
  setError: (msg: string) => void
): Promise<TransactionReceipt> {
  // free pricing v3 workaround part2
  // const response = await ocean.OceanDispenser.makeMinter(
  //   dataTokenAddress,
  //   accountId
  // )
  // if (!response) {
  //   setError('Updating DDO failed.')
  //   LoggerInstance.error('Failed at makeMinter')
  // }
  // return response

  return null
}
