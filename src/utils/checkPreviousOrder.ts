import { DDO, Ocean, ServiceType } from '@oceanprotocol/lib'

export default async function checkPreviousOrder(
  ocean: Ocean,
  accountId: string,
  ddo: DDO,
  serviceType: ServiceType
) {
  const service = ddo.findServiceByType(serviceType)
  // apparenlty cost and timeout are not found, even though they are there...
  const previousOrder = await ocean.datatokens.getPreviousValidOrders(
    ddo.dataToken,
    (service.attributes.main as any).cost,
    service.index,
    (service.attributes.main as any).timeout,
    accountId
  )
  return previousOrder
}
