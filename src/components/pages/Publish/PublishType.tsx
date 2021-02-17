import React, { ReactElement, useEffect } from 'react'
import styles from './PublishType.module.css'
import classNames from 'classnames/bind'
import Button from '../../atoms/Button'

const cx = classNames.bind(styles)

const publishTypes = [
  { display: 'data', value: 'data' },
  { display: 'algorithms', value: 'algorithms' }
]

export default function PublishType({
  type,
  setType
}: {
  type: string
  setType: React.Dispatch<React.SetStateAction<string>>
}): ReactElement {
  useEffect(() => {
    setType(publishTypes[0].value)
  }, [])

  return (
    <div>
      {publishTypes.map((e, index) => {
        const tabElement = cx({
          [styles.selected]: e.value === type,
          [styles.tabElement]: true
        })
        return (
          <Button
            size="small"
            style="text"
            key={index}
            className={tabElement}
            onClick={async () => {
              setType(e.value)
            }}
          >
            {e.display}
          </Button>
        )
      })}
    </div>
  )
}
