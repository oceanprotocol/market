import { LoggerInstance, Datatoken } from '@oceanprotocol/lib'
import { Signer, ethers } from 'ethers'

export async function setMinterToPublisher(
  signer: Signer,
  datatokenAddress: string,
  accountId: string,
  setError: (msg: string) => void
): Promise<ethers.providers.TransactionResponse> {
  const datatokenInstance = new Datatoken(signer)

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
  signer: Signer,
  datatokenAddress: string,
  accountId: string,
  setError: (msg: string) => void
): Promise<ethers.providers.TransactionResponse> {
  const datatokenInstance = new Datatoken(signer)

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
