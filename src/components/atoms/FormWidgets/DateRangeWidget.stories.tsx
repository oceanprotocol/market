import React from 'react'
import { Center } from '../../../../.storybook/helpers'
import DateRangeWidget from './DateRangeWidget'
import { PublishFormSchema } from '../../../models/PublishForm'

export default {
  title: 'Atoms/DateRangeWidget',
  decorators: [(storyFn: () => React.FC) => <Center>{storyFn()}</Center>]
}

export const DateRange = () => (
  <DateRangeWidget
    schema={PublishFormSchema}
    id="1"
    autofocus={false}
    disabled={false}
    label="Date Range"
    formContext={{}}
    readonly={false}
    value="[]"
    onBlur={() => {
      /* */
    }}
    onFocus={() => {
      /* */
    }}
    onChange={() => {
      /* */
    }}
    options={{}}
    required={false}
  />
)
