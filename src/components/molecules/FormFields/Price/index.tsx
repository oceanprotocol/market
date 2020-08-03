import React, { ReactElement, useState, ChangeEvent, useEffect } from 'react'
import { InputProps } from '../../../atoms/Input'
import styles from './index.module.css'
import Tabs from '../../../atoms/Tabs'
import Simple from './Simple'
import Advanced from './Advanced'
import { useField } from 'formik'

export default function Price(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props)

  const cost = 1
  const weightOnDataToken = '90' // in %
  const [ocean, setOcean] = useState('1')
  const [tokensToMint, setTokensToMint] = useState<number>()

  function handleOceanChange(event: ChangeEvent<HTMLInputElement>) {
    setOcean(event.target.value)
  }

  // Always update everything when ocean changes
  useEffect(() => {
    const tokensToMint = Number(ocean) * (Number(weightOnDataToken) / 10)
    setTokensToMint(tokensToMint)
    helpers.setValue({ cost, tokensToMint })
  }, [ocean])

  const tabs = [
    {
      title: 'Simple: Fixed',
      content: <Simple ocean={ocean} onChange={handleOceanChange} />
    },
    {
      title: 'Advanced: Dynamic',
      content: (
        <Advanced
          ocean={ocean}
          tokensToMint={tokensToMint}
          weightOnDataToken={weightOnDataToken}
          onChange={handleOceanChange}
        />
      )
    }
  ]

  return (
    <div className={styles.price}>
      <Tabs items={tabs} />
      <pre>
        <code>{JSON.stringify(field.value)}</code>
      </pre>
    </div>
  )
}
