import React from 'react'
import { render } from '@testing-library/react'
import Form, { transformErrors } from '../../../src/components/molecules/Form'
import {
  publishFormData,
  PublishFormDataInterface,
  PublishFormSchema,
  PublishFormUiSchema
} from '../../../src/models/PublishForm'
import testFormData from '../__fixtures__/testFormData'
import { transformPublishFormToMetadata } from '../../../src/components/molecules/PublishForm/PublishForm'
import { MetaDataMarket } from '../../../src/@types/MetaData'

describe('PublishForm', () => {
  it('renders without crashing', async () => {
    const { container } = render(
      <Form
        schema={PublishFormSchema}
        formData={testFormData}
        uiSchema={PublishFormUiSchema}
        onChange={() => null}
        onSubmit={() => null}
        onError={() => null}
      >
        Hello
      </Form>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('transformErrors() passes through data', () => {
    const errorsMock = [
      {
        message: 'Hello',
        name: 'Hello',
        params: 'Hello',
        property: 'Hello',
        stack: 'Hello'
      }
    ]

    const error = transformErrors(errorsMock)
    expect(error[0].message).toBe('Hello')
  })

  it('transformErrors() transforms data', () => {
    const errorsMock = [
      {
        message: 'Hello',
        name: 'Hello',
        params: 'Hello',
        property: '.termsAndConditions',
        stack: 'Hello'
      }
    ]

    const error = transformErrors(errorsMock)
    expect(error[0].message).not.toBe('Hello')
  })

  it('Form data is correctly transformed to asset MetaData', () => {
    const data: PublishFormDataInterface = publishFormData
    let metadata: MetaDataMarket = transformPublishFormToMetadata(data)

    expect(metadata.additionalInformation).toBeDefined()
    expect(metadata.main).toBeDefined()

    data.price = 1.3
    data.dateRange = '["2020-03-05T15:17:31Z","2020-03-10T16:00:00Z"]'

    metadata = transformPublishFormToMetadata(data)
    expect(metadata.main.price).toBe('1300000000000000000')
    expect(metadata.additionalInformation.dateRange).toEqual([
      '2020-03-05T15:17:31Z',
      '2020-03-10T16:00:00Z'
    ])
  })
})
