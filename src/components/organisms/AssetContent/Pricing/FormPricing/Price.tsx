import Conversion from '../../../../atoms/Price/Conversion'
import { useField } from 'formik'
import React, { ReactElement, useState, useEffect } from 'react'
import Input from '../../../../atoms/Input'
import { DDO } from '@oceanprotocol/lib'
import PriceUnit from '../../../../atoms/Price/PriceUnit'
import usePricing from '../../../../../hooks/usePricing'
import Error from './Error'
import {
  price,
  grid,
  form,
  datatoken,
  firstPrice as firstPriceStyle
} from './Price.module.css'

export default function Price({
  ddo,
  firstPrice
}: {
  ddo: DDO
  firstPrice?: string
}): ReactElement {
  const [field, meta] = useField('price')
  const { getDTName, getDTSymbol } = usePricing()
  const [dtSymbol, setDtSymbol] = useState<string>()
  const [dtName, setDtName] = useState<string>()

  useEffect(() => {
    if (!ddo) return
    async function setDatatokenSymbol(ddo: DDO) {
      const dtSymbol = await getDTSymbol(ddo)
      setDtSymbol(dtSymbol)
    }
    async function setDatatokenName(ddo: DDO) {
      const dtName = await getDTName(ddo)
      setDtName(dtName)
    }
    setDatatokenSymbol(ddo)
    setDatatokenName(ddo)
  }, [])

  return (
    <div className={price}>
      <div className={grid}>
        <div className={form}>
          <Input
            value={field.value}
            name="price"
            type="number"
            prefix="OCEAN"
            min="1"
            {...field}
            additionalComponent={<Conversion price={field.value} />}
          />
          <Error meta={meta} />
        </div>
        <div className={datatoken}>
          <h4>
            = <strong>1</strong> {dtName} — {dtSymbol}
          </h4>
        </div>
      </div>
      {firstPrice && (
        <aside className={firstPriceStyle}>
          Expected first price:{' '}
          <PriceUnit
            price={Number(firstPrice) > 0 ? firstPrice : '-'}
            small
            conversion
          />
        </aside>
      )}
    </div>
  )
}
