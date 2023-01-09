import axios, { AxiosResponse, CancelToken } from 'axios'
import { calicaBaseUri } from '../../../../app.config'
function getCalicaChainName(chainId: number): string {
  switch (chainId) {
    case 5:
      return 'goerli'
    case 80001:
      return 'maticmum'
    case 137:
      return 'matic'

    default:
      return ''
  }
}

export async function checkCalicaContractAddress(
  address: string,
  chainId: number,
  cancelToken?: CancelToken
): Promise<boolean> {
  const chainName = getCalicaChainName(chainId)
  const serviceUrl = `${calicaBaseUri}/api/contract?address=${address}&chain=${chainName}`

  const response: AxiosResponse<any> = await axios.get(serviceUrl, {
    cancelToken
  })
  console.log('calica response ', response, response.status)
  return true
}
