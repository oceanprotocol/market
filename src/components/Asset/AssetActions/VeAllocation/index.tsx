import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import { VeAllocate } from '@oceanprotocol/lib'
import { getOceanConfig } from '@utils/ocean'
import { Formik } from 'formik'
import React, { ReactElement, useEffect, useState } from 'react'
import FormAdd from './FormAdd'
import * as Yup from 'yup'
import styles from './index.module.css'
import Loader from '@shared/atoms/Loader'
import Button from '@shared/atoms/Button'
export interface FormAddAllocation {
  amount: number
}

const initialValues: FormAddAllocation = {
  amount: 0
}

const validationSchema: Yup.SchemaOf<FormAddAllocation> = Yup.object().shape({
  amount: Yup.number()
    .min(0, (param) => `Must be more or equal to ${param.min}`)
    .max(100, `Maximum you can allocate is 100%`)
    .required('Required')
})

export default function VeAllocation(): ReactElement {
  const { web3, accountId } = useWeb3()
  const { asset } = useAsset()
  const [allocation, setAllocation] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  async function handleUpdateAllocation(amount: number, resetForm: () => void) {
    console.log('submit')

    const config = getOceanConfig(5)
    const veAllocation = new VeAllocate(
      '0x3EFDD8f728c8e774aB81D14d0B2F07a8238960f4',
      web3
    )
    const tx = await veAllocation.setAllocation(
      accountId,
      (amount * 100).toString(),
      asset.nftAddress,
      asset.chainId
    )
  }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await handleUpdateAllocation(values.amount, resetForm)
        setSubmitting(false)
      }}
    >
      {({ isSubmitting, setSubmitting, submitForm, values, isValid }) => (
        <>
          <div>
            <FormAdd amount={allocation} />
          </div>
          <div className={styles.actions}>
            {isLoading ? (
              <Loader message="Updating allocation ..." />
            ) : (
              <Button
                style="primary"
                size="small"
                onClick={() => submitForm()}
                disabled={isSubmitting}
              >
                Update allocation{' '}
              </Button>
            )}
          </div>
        </>
      )}
    </Formik>
  )
}
