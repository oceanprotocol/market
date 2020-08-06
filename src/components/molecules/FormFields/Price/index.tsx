import React, { ReactElement, useState, ChangeEvent, useEffect } from 'react'
import { InputProps } from '../../../atoms/Input'
import styles from './index.module.css'
import Tabs from '../../../atoms/Tabs'
import Simple from './Simple'
import Advanced from './Advanced'
import { useField } from 'formik'

export default function Price(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props)
  const { weightOnDataToken } = field.value

  const [ocean, setOcean] = useState('1')
  const [tokensToMint, setTokensToMint] = useState<number>()

  function handleOceanChange(event: ChangeEvent<HTMLInputElement>) {
    setOcean(event.target.value)
  }

  function handleTabChange(tabName: string) {
    const type = tabName.startsWith('Simple') ? 'simple' : 'advanced'
    helpers.setValue({ ...field.value, type })
  }

  // Always update everything when ocean changes
  useEffect(() => {
    const tokensToMint = Number(ocean) * Number(weightOnDataToken)
    setTokensToMint(tokensToMint)
    console.log(field.value)
    helpers.setValue({ ...field.value, tokensToMint })
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
      <Tabs items={tabs} handleTabChange={handleTabChange} />
      <pre>
        <code>{JSON.stringify(field.value)}</code>
      </pre>
    </div>
  )
}
