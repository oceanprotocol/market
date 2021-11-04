import { Ocean } from '@oceanprotocol/lib'
import { getServiceByName } from './ddo'

export default async function checkPreviousOrder(
  ocean: Ocean,
  accountId: string,
  ddo: Asset,
  serviceType: 'access' | 'compute'
): Promise<string> {
  if (!ocean) return

  const service = getServiceByName(ddo, serviceType)
  // apparenlty cost and timeout are not found, even though they are there...
  const previousOrder = await ocean.datatokens.getPreviousValidOrders(
    ddo?.services[0].datatokenAddress,
    service.cost,
    service.index,
    service.timeout,
    accountId
  )
  return previousOrder
}
