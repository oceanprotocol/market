import { MetaDataMarket } from '../@types/MetaData'

const AssetModel: MetaDataMarket = {
  // OEP-8 Attributes
  // https://github.com/oceanprotocol/OEPs/tree/master/8
  main: {
    type: 'dataset',
    name: '',
    dateCreated: '',
    author: '',
    license: '',
    price: '0',
    files: []
  },
  additionalInformation: {
    description: '',
    copyrightHolder: '',
    tags: undefined,
    // links: [],

    // custom items
    deliveryType: 'files',
    termsAndConditions: false,
    dateRange: undefined,
    supportName: undefined,
    supportEmail: undefined,
    access: 'Download'
  },
  curation: {
    rating: 0,
    numVotes: 0,
    schema: '5-star voting',
    isListed: true
  }
}

export default AssetModel
