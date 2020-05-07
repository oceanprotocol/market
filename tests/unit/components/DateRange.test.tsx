import React from 'react'
import { render } from '@testing-library/react'
import DateRangeWidget, {
  getWidgetValue
} from '../../../src/components/atoms/FormWidgets/DateRangeWidget'
import { PublishFormSchema } from '../../../src/models/PublishForm'
import { act } from 'react-test-renderer'

describe('Date Range Widget', () => {
  it('renders without crashing', () => {
    act(() => {
      const { container } = render(
        <DateRangeWidget
          schema={PublishFormSchema}
          id="1"
          autofocus={false}
          disabled={false}
          label="Date Range"
          formContext={{}}
          readonly={false}
          value={'["2020-03-15T15:13:30Z", "2020-03-18T15:13:30Z"]'}
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
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  it('getWidgetValue returns a correctly encoded string', () => {
    expect(
      getWidgetValue(
        new Date('2020-03-15T15:13:30.123Z'),
        new Date('2020-03-18T15:13:30.456Z'),
        false
      )
    ).toEqual('["2020-03-15T15:13:30Z","2020-03-15T15:13:30Z"]')

    expect(
      getWidgetValue(
        new Date('2020-03-15T15:13:30.123Z'),
        new Date('2020-03-18T18:13:30.456Z'),
        true
      )
    ).toEqual('["2020-03-15T15:13:30Z","2020-03-18T18:13:30Z"]')
  })
})
