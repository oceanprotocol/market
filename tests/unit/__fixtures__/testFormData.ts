import { MetadataPublishForm } from '../../../src/@types/Metadata'

const testFormData: MetadataPublishForm = {
  author: '',
  files: [],
  license: '',
  price: {
    price: 1,
    tokensToMint: 9,
    type: 'fixed',
    weightOnDataToken: '1',
    liquidityProviderFee: 0.1
  },
  name: '',
  description: 'description',
  termsAndConditions: true,
  access: 'Download'
  // links: []
}

export default testFormData
