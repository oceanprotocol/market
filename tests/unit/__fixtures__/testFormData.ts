import { MetadataPublishForm } from '../../../src/@types/MetaData'

const testFormData: MetadataPublishForm = {
  author: '',
  files: [],
  license: '',
  price: {
    price: 1,
    tokensToMint: 9,
    type: 'fixed',
    weightOnDataToken: '1',
    swapFee: 0.1
  },
  name: '',
  description: 'description',
  termsAndConditions: true,
  access: 'Download'
  // links: []
}

export default testFormData
