import React, { ReactElement, useEffect } from 'react'
import styles from './PublishType.module.css'
import classNames from 'classnames/bind'
import Button from '../../atoms/Button'

const cx = classNames.bind(styles)

export const TypeOfPublish = {
  dataset: 'dataset',
  algorithm: 'algorithm'
} as const
type TypeOfPublish = typeof TypeOfPublish[keyof typeof TypeOfPublish]

export function PublishType({
  type,
  setType
}: {
  type: string
  setType: React.Dispatch<React.SetStateAction<string>>
}): ReactElement {
  useEffect(() => {
    setType(TypeOfPublish.dataset)
  }, [])

  return (
    <div>
      {Object.keys(TypeOfPublish).map((key, index) => {
        const tabElement = cx({
          [styles.selected]: key === type,
          [styles.tabElement]: true
        })
        return (
          <Button
            size="small"
            style="text"
            key={index}
            className={tabElement}
            onClick={async () => {
              setType(key)
            }}
          >
            {key}
          </Button>
        )
      })}
    </div>
  )
}
