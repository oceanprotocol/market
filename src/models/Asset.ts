import { MetadataMarket } from '../@types/Metadata'

const AssetModel: MetadataMarket = {
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
    tags: [],
    links: [],

    // custom items
    termsAndConditions: false,
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
