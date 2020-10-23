import { DDO, Ocean, ServiceType } from '@oceanprotocol/lib'

export default async function checkPreviousOrder(
  ocean: Ocean,
  accountId: string,
  ddo: DDO,
  serviceType: ServiceType
) {
  const service = ddo.findServiceByType(serviceType)
  const previousOrder = await ocean.datatokens.getPreviousValidOrders(
    ddo.dataToken,
    service.attributes.main.cost,
    service.index,
    service.attributes.main.timeout,
    accountId
  )
  return previousOrder
}
