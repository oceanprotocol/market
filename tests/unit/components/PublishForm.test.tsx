import React from 'react'
import { render } from '@testing-library/react'
import { transformPublishFormToMetadata } from '../../../src/utils/metadata'
import {
  MetadataMarket,
  MetadataPublishFormDataset
} from '../../../src/@types/MetaData'
import PublishForm from '../../../src/components/pages/Publish/FormPublish'
import publishFormData from '../__fixtures__/testFormData'

describe('PublishForm', () => {
  it('renders without crashing', async () => {
    const { container } = render(<PublishForm />)
    expect(container.firstChild).toBeInTheDocument()
  })

  // it('Form data is correctly transformed to asset Metadata', () => {
  //   const data: MetadataPublishFormDataset = publishFormData
  //   let metadata: MetadataMarket = transformPublishFormToMetadata(data)

  //   expect(metadata.additionalInformation).toBeDefined()
  //   expect(metadata.main).toBeDefined()

  //   data.price = '1.3'

  //   metadata = transformPublishFormToMetadata(data)
  //   expect(metadata.main.price).toBe('1300000000000000000')
  // })
})
