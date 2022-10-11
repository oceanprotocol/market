import React, { ReactElement, useEffect, useState } from 'react'
import styles from './FormAdd.module.css'
import Input from '@shared/FormInput'
import Error from '@shared/FormInput/Error'
import { FormikContextType, useField, useFormikContext } from 'formik'
import Button from '@shared/atoms/Button'
import { useWeb3 } from '@context/Web3'
import { FormAddAllocation } from '.'
import { useAsset } from '@context/Asset'
import { getOceanConfig } from '@utils/ocean'
import { VeAllocate } from '@oceanprotocol/lib'

export default function FormAdd({ amount }: { amount: number }): ReactElement {
  const [isOnCorrectNetwork, setIsOnCorrectNetwork] = useState(true)
  const { web3, accountId } = useWeb3()
  const { asset } = useAsset()
  // Connect with form
  const { setFieldValue, isSubmitting }: FormikContextType<FormAddAllocation> =
    useFormikContext()
  const [field, meta] = useField('amount')
  useEffect(() => {
    async function init() {
      const config = getOceanConfig(5)
      const veAllocation = new VeAllocate(
        '0x3EFDD8f728c8e774aB81D14d0B2F07a8238960f4',
        web3
      )
      const allocation = await veAllocation.getVeAllocation(
        accountId,
        asset.nftAddress,
        asset.chainId.toString()
      )
      setFieldValue('amount', allocation / 100)
      console.log('allocation', allocation)
    }
    init()
  }, [])

  return (
    <>
      <Input
        type="number"
        min="0"
        max="100"
        prefix="Allocation"
        step="10"
        placeholder="0"
        disabled={!isOnCorrectNetwork || isSubmitting}
        {...field}
        additionalComponent={<Error meta={meta} />}
      />
      <Button
        className={styles.buttonMax}
        style="text"
        size="small"
        disabled={!web3 || isSubmitting}
        onClick={() => setFieldValue('amount', amount)}
      >
        Use Max
      </Button>
    </>
  )
}
