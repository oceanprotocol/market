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
  try {
    const accountId = String(request.query.accountId)
    const ens = await getEns()
    let name = await ens.getName(accountId)

    // Check to be sure the reverse record is correct.
    const reverseAccountId = await ens.name(name.name).getAddress()
    console.log('reverseAccountId', reverseAccountId)
    if (accountId.toLowerCase() !== reverseAccountId.toLowerCase()) name = null

    console.log('name 2', name)
    response.send(name)
  } catch (error) {
    console.log('error 2: ', error)
    response.send(`${error}`)
  }
}
