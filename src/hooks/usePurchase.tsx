import { useState } from 'react'
import { Logger, DDO } from '@oceanprotocol/squid'
import useOcean from './useOcean'
import useWeb3 from './useWeb3'

/**
 * Consume/purchase asset hook.
 */
export default function usePurchaseAsset() {
  const { web3 } = useWeb3()
  const { ocean } = useOcean(web3)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [feedbackStep, setFeedbackStep] = useState(99)

  const purchaseAsset = async (ddo: DDO) => {
    if (!ocean) return

    setIsLoading(true)

    try {
      const account = (await ocean.accounts.list())[0]
      const agreements = await ocean.keeper.conditions.accessSecretStoreCondition.getGrantedDidByConsumer(
        account.getId()
      )
      const agreement = agreements.find((el: any) => el.did === ddo.id)
      const agreementId = agreement
        ? agreement.agreementId
        : await ocean.assets
            .order(ddo.id, account)
            .next(step => setFeedbackStep(step))

      // manually add another step here for better UX
      setFeedbackStep(4)
      const path = await ocean.assets.consume(agreementId, ddo.id, account, '')
      Logger.log('path', path)
    } catch (error) {
      setError(error)
      Logger.error('error', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return { purchaseAsset, isLoading, feedbackStep, error }
}
