import { Ocean, BestPrice, Logger } from '@oceanprotocol/lib'

const priceError: BestPrice = {
  type: '',
  address: '',
  pools: [],
  datatoken: 0,
  value: 0,
  isConsumable: ''
}

export async function getFirstExchangePrice(
  ocean: Ocean,
  dataTokenAddress: string
): Promise<BestPrice> {
  try {
    const tokenExchanges = await ocean.fixedRateExchange.searchforDT(
      dataTokenAddress,
      '1'
    )
    if (tokenExchanges === undefined || tokenExchanges.length === 0) {
      return priceError
    }

    const [tokenExchange] = tokenExchanges

    return {
      type: 'exchange',
      pools: [],
      address: tokenExchange.exchangeID || '',
      value: Number(tokenExchange.fixedRate),
      ocean: 0,
      datatoken: Number(tokenExchange.supply),
      isConsumable: Number(tokenExchange.supply) > 0 ? 'true' : 'false'
    }
  } catch (err) {
    Logger.log(err)
    return priceError
  }
}

export async function getFirstPoolPrice(
  ocean: Ocean,
  dataTokenAddress: string,
  poolAddress?: string
): Promise<BestPrice> {
  let firstPoolAddress = poolAddress
  if (!poolAddress) {
    const tokenPools = await ocean.pool.searchPoolforDT(dataTokenAddress)

    if (tokenPools === undefined || tokenPools.length === 0) {
      return priceError
    }
    ;[firstPoolAddress] = tokenPools
  }

  if (!firstPoolAddress) return priceError

  const firstPoolPrice = await ocean.pool.calcInGivenOut(
    firstPoolAddress,
    ocean.pool.oceanAddress,
    dataTokenAddress,
    '1'
  )
  const usePrice = await ocean.pool.getOceanNeeded(firstPoolAddress, '1')
  const oceanReserve = await ocean.pool.getOceanReserve(firstPoolAddress)

  const dtReserve = await ocean.pool.getDTReserve(firstPoolAddress)

  return {
    type: 'pool',
    pools: [firstPoolAddress],
    address: firstPoolAddress,
    value: Number(firstPoolPrice),
    ocean: Number(oceanReserve),
    datatoken: Number(dtReserve),
    isConsumable: Number(usePrice) > 0 ? 'true' : 'false'
  }
}

export async function getDataTokenPrice(
  ocean: Ocean,
  dataTokenAddress: string,
  type: string,
  poolAddress?: string
): Promise<BestPrice> {
  const price =
    type === 'pool'
      ? await getFirstPoolPrice(ocean, dataTokenAddress, poolAddress)
      : await getFirstExchangePrice(ocean, dataTokenAddress)

  return price
}
