import { DDO, Logger, Metadata } from '@oceanprotocol/lib'
import {
  Service,
  ServiceComputePrivacy,
  ServiceType
} from '@oceanprotocol/lib/dist/node/ddo/interfaces/Service'
import { useState } from 'react'
import { sleep } from '../utils'
import { publishFeedback } from '../utils/feedback'
import { useOcean } from '../providers/Ocean'

interface DataTokenOptions {
  cap?: string
  name?: string
  symbol?: string
}

interface UsePublish {
  publish: (
    asset: Metadata,
    serviceType: ServiceType,
    dataTokenOptions?: DataTokenOptions,
    timeout?: number,
    providerUri?: string
  ) => Promise<DDO | undefined | null>
  publishStep?: number
  publishStepText?: string
  publishError?: string
  isLoading: boolean
}

function usePublish(): UsePublish {
  const { ocean, account } = useOcean()
  const [isLoading, setIsLoading] = useState(false)
  const [publishStep, setPublishStep] = useState<number | undefined>()
  const [publishStepText, setPublishStepText] = useState<string | undefined>()
  const [publishError, setPublishError] = useState<string | undefined>()

  function setStep(index?: number) {
    setPublishStep(index)
    index && setPublishStepText(publishFeedback[index])
  }
  /**
   * Publish an asset. It also creates the datatoken, mints tokens and gives the market allowance
   * @param  {Metadata} asset The metadata of the asset.
   * @param  {PriceOptions}  priceOptions : number of tokens to mint, datatoken weight , liquidity fee, type : fixed, dynamic
   * @param  {ServiceType} serviceType Desired service type of the asset access or compute
   * @param  {DataTokenOptions} dataTokenOptions custom name, symbol and cap for datatoken
   * @return {Promise<DDO>} Returns the newly published ddo
   */
  async function publish(
    asset: Metadata,
    serviceType: ServiceType,
    dataTokenOptions?: DataTokenOptions,
    timeout?: number,
    providerUri?: string
  ): Promise<DDO | undefined | null> {
    if (!ocean || !account) return null
    setIsLoading(true)
    setPublishError(undefined)
    setStep(0)
    console.log(providerUri)

    try {
      const publishedDate =
        new Date(Date.now()).toISOString().split('.')[0] + 'Z'
      const services: Service[] = []
      const price = '1'

      switch (serviceType) {
        case 'access': {
          if (!timeout) timeout = 0
          const accessService =
            await ocean.assets.createAccessServiceAttributes(
              account,
              price,
              publishedDate,
              timeout,
              providerUri
            )
          Logger.log('access service created', accessService)
          services.push(accessService)
          break
        }
        case 'compute': {
          if (!timeout) timeout = 3600
          const provider = {}
          const origComputePrivacy: ServiceComputePrivacy = {
            allowRawAlgorithm: false,
            allowNetworkAccess: false,
            allowAllPublishedAlgorithms: false,
            publisherTrustedAlgorithms: []
          }
          const computeService = ocean.compute.createComputeService(
            account,
            price,
            publishedDate,
            provider,
            origComputePrivacy,
            timeout,
            providerUri
          )
          services.push(computeService)
          break
        }
      }

      Logger.log('services created', services)

      const ddo = await ocean.assets
        .create(
          asset,
          account,
          services,
          undefined,
          dataTokenOptions?.cap,
          dataTokenOptions?.name,
          dataTokenOptions?.symbol,
          providerUri
        )
        .next(setStep)

      await ocean.assets.publishDdo(ddo, account.getId())
      Logger.log('ddo created', ddo)
      await sleep(20000)
      setStep(7)
      return ddo
    } catch (error) {
      setPublishError(error.message)
      Logger.error(error)
      setStep()
    } finally {
      setIsLoading(false)
    }
  }

  return {
    publish,
    publishStep,
    publishStepText,
    isLoading,
    publishError
  }
}

export { usePublish, UsePublish, DataTokenOptions }
export default usePublish
