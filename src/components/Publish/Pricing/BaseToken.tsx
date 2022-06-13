import React, {
  ChangeEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState
} from 'react'
import { useWeb3 } from '@context/Web3'
import Input from '@shared/FormInput'
import { getOpcsApprovedTokens } from '@utils/subgraph'
import { useFormikContext } from 'formik'
import { FormPublishData } from '../_types'

export default function BaseToken(): ReactElement {
  const { values, setFieldValue } = useFormikContext<FormPublishData>()
  const { chainId } = useWeb3()
  const [approvedBaseTokens, setApprovedBaseTokens] = useState([
    values.pricing.baseToken
  ])
  const init = useCallback(async () => {
    if (!chainId) return
    setApprovedBaseTokens(await getOpcsApprovedTokens(chainId))
  }, [chainId])

  useEffect(() => {
    init()
  }, [init])

  const handleBaseTokenSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedBaseToken = approvedBaseTokens.find(
      (token) => token.symbol === e.target.value
    )
    setFieldValue('pricing.baseTokenAddress', selectedBaseToken)
  }

  return (
    <Input
      type="select"
      options={approvedBaseTokens.map((e) => e.symbol)}
      onChange={handleBaseTokenSelection}
    />
  )
}
