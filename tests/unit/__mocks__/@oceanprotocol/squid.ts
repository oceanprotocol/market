import ddo from '../../__fixtures__/ddo'
import job from '../../__fixtures__/job'

const aquarius = {
  queryMetadata: () => {
    return {
      results: [] as any[],
      totalResults: 1,
      totalPages: 1
    }
  }
}

const squidMock = {
  Aquarius: () => aquarius,
  DDO: () => ddo,
  ocean: {
    accounts: {
      list: () => ['xxx', 'xxx']
    },
    aquarius,
    compute: {
      status: (account: string) => {
        return [job]
      }
    },
    assets: {
      query: () => {
        return {
          results: [ddo] as any[],
          page: 1,
          total_pages: 1611,
          total_results: 1611
        }
      },
      resolve: () => null as any,
      order: () => {
        return {
          next: () => null as any
        }
      },
      consume: () => null as any,
      getFreeWhiteList: () => Promise.resolve([])
    },
    keeper: {
      conditions: {
        accessSecretStoreCondition: {
          getGrantedDidByConsumer: () => {
            return {
              find: Promise.resolve(
                'did:op:e6fda48e8d814d5d9655645aac3c046cc87528dbc1a9449799e579d7b83d1360'
              )
            }
          }
        }
      },
      agreementStoreManager: {
        getAgreement: (agreementId: string) =>
          Promise.resolve({
            did:
              'did:op:e6fda48e8d814d5d9655645aac3c046cc87528dbc1a9449799e579d7b83d1360'
          })
      }
    },
    versions: {
      get: () =>
        Promise.resolve({
          squid: {
            name: 'Squid-js',
            status: 'Working'
          },
          aquarius: {
            name: 'Aquarius',
            status: 'Working'
          },
          brizo: {
            name: 'Brizo',
            network: 'Nile',
            status: 'Working',
            contracts: {
              hello: 'hello',
              hello2: 'hello2'
            }
          },
          status: {
            ok: true,
            network: true,
            contracts: true
          }
        })
    }
  }
}

export default squidMock
