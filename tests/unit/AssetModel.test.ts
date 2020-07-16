import AssetModel from '../../src/models/Asset'
import { MetadataMarket } from '../../src/@types/Metadata'

describe('AssetModel', () => {
  it('values can be reassigned', () => {
    const newMeta: MetadataMarket = {
      main: Object.assign(AssetModel.main, {
        name: 'Hello'
      }),
      additionalInformation: Object.assign(AssetModel.additionalInformation, {
        description: 'Jelly McJellyfish'
      }),
      curation: Object.assign(AssetModel.curation, {
        numVotes: 100,
        rating: 5
      })
    }

    expect(newMeta).toMatchObject(AssetModel)
    expect(newMeta.main.name).toBe('Hello')
    expect(newMeta.additionalInformation.description).toBe('Jelly McJellyfish')
  })
})
