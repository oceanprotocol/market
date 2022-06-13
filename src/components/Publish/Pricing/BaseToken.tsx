import { useWeb3 } from '@context/Web3'
import Input from '@shared/FormInput'
import { getOpcsApprovedTokens } from '@utils/subgraph'
import { useFormikContext } from 'formik'
import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import { FormPublishData } from '../_types'

export default function BaseToken(): ReactElement {
  const { values, setFieldValue } = useFormikContext<FormPublishData>()
  const { chainId } = useWeb3()
  const [approvedBaseTokens, setApprovedBaseTokens] = useState([
    values.pricing.baseTokenAddress
  ])
  const init = async () => {
    const baseTokens = await getOpcsApprovedTokens(chainId)
    setApprovedBaseTokens(baseTokens)
  }

  useEffect(() => {
    init()
  }, [chainId])

  const handleBaseTokenSelection = (e: ChangeEvent<HTMLSelectElement>) =>
    setFieldValue('pricing.baseTokenAddress', e.target.value)

  return (
    <div>
      <Input
        type="select"
        options={approvedBaseTokens}
        onChange={handleBaseTokenSelection}
      />
    </div>
  )
}
