import { MetadataPublishForm } from '../../../src/@types/Metadata'

const testFormData: MetadataPublishForm = {
  author: '',
  files: [],
  license: '',
  price: {
    tokensToMint: 1,
    type: 'simple',
    weightOnDataToken: '1',
    liquidityProviderFee: '0.1'
  },
  name: '',
  description: 'description',
  termsAndConditions: true,
  access: 'Download'
  // links: []
}

export default testFormData
