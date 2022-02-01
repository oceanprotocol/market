import Button from '@shared/atoms/Button'
import React, {
  ChangeEvent,
  Dispatch,
  ReactElement,
  SetStateAction
} from 'react'
import styles from './Nav.module.css'
import { graphTypes, GraphType } from './_constants'

export default function Nav({
  graphType,
  setGraphType
}: {
  graphType: GraphType
  setGraphType: Dispatch<SetStateAction<GraphType>>
}): ReactElement {
  function handleGraphTypeSwitch(e: ChangeEvent<HTMLButtonElement>) {
    e.preventDefault()
    setGraphType(e.currentTarget.textContent.toLowerCase() as GraphType)
  }

  return (
    <nav className={styles.type}>
      {graphTypes.map((type: GraphType) => (
        <Button
          key={type}
          style="text"
          size="small"
          onClick={handleGraphTypeSwitch}
          className={`${styles.button} ${
            graphType === type.toLowerCase() ? styles.active : null
          }`}
        >
          {type}
        </Button>
      ))}
    </nav>
  )
}
