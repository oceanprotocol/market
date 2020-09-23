import ddo from '../../__fixtures__/ddo'
import job from '../../__fixtures__/job'

const metadataStore = {
  queryMetadata: () => {
    return {
      results: [] as any[],
      totalResults: 1,
      totalPages: 1
    }
  }
}

const libMock = {
  MetadataStore: () => metadataStore,
  DDO: () => ddo,
  ocean: {
    accounts: {
      list: () => ['xxx', 'xxx']
    },
    metadataStore,
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
    versions: {
      get: () =>
        Promise.resolve({
          squid: {
            name: 'Squid-js',
            status: 'Working'
          },
          metadataStore: {
            name: 'MetadataStore',
            status: 'Working'
          },
          provider: {
            name: 'Provider',
            network: 'Rinkeby',
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

export default libMock
