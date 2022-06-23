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

export default function BaseToken({
  defaultBaseToken
}: {
  defaultBaseToken: TokenInfo
}): ReactElement {
  const { values, setFieldValue } = useFormikContext<FormPublishData>()
  const { chainId } = useWeb3()
  const [approvedBaseTokens, setApprovedBaseTokens] = useState<TokenInfo[]>([])

  const init = useCallback(async () => {
    if (!chainId) return
    setApprovedBaseTokens(await getOpcsApprovedTokens(chainId))
  }, [chainId])

  useEffect(() => {
    if (!values.pricing?.baseToken?.address) {
      setFieldValue('pricing.baseToken', defaultBaseToken)
    }
    init()
  }, [
    defaultBaseToken,
    init,
    setFieldValue,
    values.pricing?.baseToken?.address
  ])

  const handleBaseTokenSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedBaseToken = approvedBaseTokens.find(
      (token) => token.symbol === e.target.value
    )
    setFieldValue('pricing.baseToken', selectedBaseToken)
  }

  return (
    <Input
      type="select"
      options={approvedBaseTokens.map((e) => e.symbol)}
      onChange={handleBaseTokenSelection}
    />
  )
}
