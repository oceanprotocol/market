import { ListItem } from '@shared/atoms/Lists'
import { useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import { FormPublishData } from '../_types'

export function Feedback(): ReactElement {
  const { values } = useFormikContext<FormPublishData>()

  const items = Object.entries(values.feedback).map(([key, value], index) => {
    return (
      <ListItem ol key={index}>
        {value.name}
      </ListItem>
    )
  })

  return <ol>{items}</ol>
}
