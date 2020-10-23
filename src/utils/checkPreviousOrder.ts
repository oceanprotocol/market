import { DDO, Ocean } from '@oceanprotocol/lib'

export default async function checkPreviousOrder(
  ocean: Ocean,
  accountId: string,
  ddo: DDO
) {
  const service = ddo.findServiceByType('access')
  const previousOrder = await ocean.datatokens.getPreviousValidOrders(
    ddo.dataToken,
    service.attributes.main.cost,
    service.index,
    service.attributes.main.timeout,
    accountId
  )
  return previousOrder
}
