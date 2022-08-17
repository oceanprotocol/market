import { NextApiRequest, NextApiResponse } from 'next'
import ENS, { getEnsAddress as getEnsAddressVendor } from '@ensdomains/ensjs'
import { getDummyWeb3 } from '@utils/web3'

let ens: any

// export default function handler(
//   request: NextApiRequest,
//   response: NextApiResponse
// ) {
//   console.log('request', request.body.name)
//   const { name } = request.query
//   response.end(`Hello, how are you ${name}?`)
// }

async function getEns(): Promise<any> {
  const _ens =
    ens ||
    new ENS({
      provider: (await getDummyWeb3(1)).currentProvider,
      ensAddress: getEnsAddressVendor(1)
    })
  ens = _ens

  return _ens
}

export default async function getEnsName(
  request: NextApiRequest,
  response: NextApiResponse
) {
  console.log('request.body', request.query)
  console.log('accountId', request.query.accountId)
  const accountId = String(request.query.accountId)
  console.log('accountId', accountId)
  const ens = await getEns()
  let name
  try {
    name = await ens.getName(accountId)
  } catch (error) {
    console.log('error', error)
  }
  console.log('name', name)

  // Check to be sure the reverse record is correct.
  const reverseAccountId = await ens.name(name).getAddress()
  if (accountId.toLowerCase() !== reverseAccountId.toLowerCase()) name = null

  response.end(name)
}
