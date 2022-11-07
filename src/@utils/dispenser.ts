import { LoggerInstance, Datatoken } from '@oceanprotocol/lib'
import Web3 from 'web3'
import { TransactionReceipt } from 'web3-core'

export async function setMinterToPublisher(
  web3: Web3,
  datatokenAddress: string,
  accountId: string,
  setError: (msg: string) => void
): Promise<TransactionReceipt> {
  const datatokenInstance = new Datatoken(web3)

  const response = await datatokenInstance.removeMinter(
    datatokenAddress,
    accountId,
    accountId
  )

  if (!response) {
    setError('Updating DDO failed.')
    LoggerInstance.error('Failed at cancelMinter')
  }
  return response
}

export async function setMinterToDispenser(
  web3: Web3,
  datatokenAddress: string,
  accountId: string,
  setError: (msg: string) => void
): Promise<TransactionReceipt> {
  const datatokenInstance = new Datatoken(web3)

  const response = await datatokenInstance.addMinter(
    datatokenAddress,
    accountId,
    accountId
  )
  if (!response) {
    setError('Updating DDO failed.')
    LoggerInstance.error('Failed at makeMinter')
  }
  return response
}
