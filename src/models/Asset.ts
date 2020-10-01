import { MetadataMarket } from '../@types/MetaData'

const AssetModel: MetadataMarket = {
  // OEP-8 Attributes
  // https://github.com/oceanprotocol/OEPs/tree/master/8
  main: {
    type: 'dataset',
    name: undefined,
    dateCreated: undefined,
    author: undefined,
    license: undefined,
    files: []
  },
  additionalInformation: {
    description: undefined,
    copyrightHolder: undefined,
    tags: undefined,
    links: undefined,

    // custom items
    termsAndConditions: false,
    priceType: undefined
  }
}

export default AssetModel
