import AssetModel from '../../src/models/Asset'
import { MetaDataDexFreight } from '../../src/@types/MetaData'

describe('AssetModel', () => {
  it('values can be reassigned', () => {
    const newMeta: MetaDataDexFreight = {
      main: Object.assign(AssetModel.main, {
        name: 'Hello'
      }),
      additionalInformation: Object.assign(AssetModel.additionalInformation, {
        supportName: 'Jelly McJellyfish'
      }),
      curation: Object.assign(AssetModel.curation, {
        numVotes: 100,
        rating: 5
      })
    }

    expect(newMeta).toMatchObject(AssetModel)
    expect(newMeta.main.name).toBe('Hello')
    expect(newMeta.additionalInformation.supportName).toBe('Jelly McJellyfish')
  })
})
