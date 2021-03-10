import { Ocean, BestPrice, Logger } from '@oceanprotocol/lib'
import { Decimal } from 'decimal.js'

export async function getCheapestPoolPrice(
  ocean: Ocean,
  dataTokenAddress: string
): Promise<BestPrice> {
  const tokenPools = await ocean.pool.searchPoolforDT(dataTokenAddress)

  if (tokenPools === undefined || tokenPools.length === 0) {
    return {
      type: '',
      address: '',
      pools: [],
      datatoken: 0,
      value: 0,
      isConsumable: ''
    }
  }
  let cheapestPoolAddress = tokenPools[0]
  let cheapestPoolPrice = new Decimal(999999999999)

  if (tokenPools) {
    for (let i = 0; i < tokenPools.length; i++) {
      const poolPrice = await ocean.pool.calcInGivenOut(
        tokenPools[i],
        ocean.pool.oceanAddress,
        dataTokenAddress,
        '1'
      )
      const decimalPoolPrice = new Decimal(poolPrice)

      if (decimalPoolPrice < cheapestPoolPrice) {
        cheapestPoolPrice = decimalPoolPrice
        cheapestPoolAddress = tokenPools[i]
      }
    }
  }

  const usePrice = await ocean.pool.getOceanNeeded(cheapestPoolAddress, '1')
  const oceanReserve = await ocean.pool.getOceanReserve(cheapestPoolAddress)
  const dtReserve = await ocean.pool.getDTReserve(cheapestPoolAddress)

  return {
    type: 'pool',
    pools: [cheapestPoolAddress],
    address: cheapestPoolAddress,
    value: Number(cheapestPoolPrice),
    ocean: Number(oceanReserve),
    datatoken: Number(dtReserve),
    isConsumable: Number(usePrice) > 0 ? 'true' : 'false'
  }
}

export async function getCheapestExchangePrice(
  ocean: Ocean,
  dataTokenAddress: string
): Promise<BestPrice> {
  try {
    const tokenExchanges = await ocean.fixedRateExchange.searchforDT(
      dataTokenAddress,
      '1'
    )
    if (tokenExchanges === undefined || tokenExchanges.length === 0) {
      return {
        type: '',
        address: '',
        pools: [],
        datatoken: 0,
        value: 0,
        isConsumable: ''
      }
    }
    let cheapestExchangeAddress = tokenExchanges[0].exchangeID
    let cheapestExchangePrice = new Decimal(tokenExchanges[0].fixedRate)

    for (let i = 0; i < tokenExchanges.length; i++) {
      const decimalExchangePrice = new Decimal(tokenExchanges[i].fixedRate)

      if (decimalExchangePrice < cheapestExchangePrice) {
        cheapestExchangePrice = decimalExchangePrice
        cheapestExchangeAddress = tokenExchanges[i].exchangeID
      }
    }

    const dtReserve = cheapestExchangeAddress
      ? await ocean.fixedRateExchange.getSupply(cheapestExchangeAddress)
      : '0'
    return {
      type: 'exchange',
      pools: [],
      address: cheapestExchangeAddress || '',
      value: Number(cheapestExchangePrice),
      ocean: 0,
      datatoken: Number(dtReserve),
      isConsumable: Number(dtReserve) > 0 ? 'true' : 'false'
    }
  } catch (err) {
    Logger.log(err)
    return {
      type: '',
      address: '',
      pools: [],
      datatoken: 0,
      value: 0,
      isConsumable: ''
    }
  }
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
      return {
        type: '',
        address: '',
        pools: [],
        datatoken: 0,
        value: 0,
        isConsumable: ''
      }
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
    return {
      type: '',
      address: '',
      pools: [],
      datatoken: 0,
      value: 0,
      isConsumable: ''
    }
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
      return {
        type: '',
        address: '',
        pools: [],
        datatoken: 0,
        value: 0,
        isConsumable: ''
      }
    }
    ;[firstPoolAddress] = tokenPools
  }
  if (!firstPoolAddress) {
    return {
      type: '',
      address: '',
      pools: [],
      datatoken: 0,
      value: 0,
      isConsumable: ''
    }
  }

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

export async function getBestDataTokenPrice(
  ocean: Ocean,
  dataTokenAddress: string
): Promise<BestPrice> {
  const cheapestPool = await getCheapestPoolPrice(ocean, dataTokenAddress)
  const cheapestExchange = await getCheapestExchangePrice(
    ocean,
    dataTokenAddress
  )
  Decimal.set({ precision: 5 })

  const cheapestPoolPrice = new Decimal(
    cheapestPool && cheapestPool.value !== 0 ? cheapestPool.value : 999999999999
  )
  const cheapestExchangePrice = new Decimal(
    cheapestExchange && cheapestExchange?.value !== 0
      ? cheapestExchange.value
      : 999999999999
  )

  return cheapestPoolPrice < cheapestExchangePrice
    ? cheapestPool
    : cheapestExchange
}

export async function getDataTokenPrice(
  ocean: Ocean,
  dataTokenAddress: string,
  type?: string,
  poolAddress?: string
): Promise<BestPrice> {
  switch (type) {
    case 'pool': {
      return await getFirstPoolPrice(ocean, dataTokenAddress, poolAddress)
    }
    case 'exchange': {
      return await getFirstExchangePrice(ocean, dataTokenAddress)
    }
    default: {
      return await getBestDataTokenPrice(ocean, dataTokenAddress)
    }
  }
}
