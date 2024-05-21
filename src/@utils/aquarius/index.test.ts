import {
  SortDirectionOptions,
  SortTermOptions
} from '../../@types/aquarius/SearchQuery'
import { escapeEsReservedCharacters, getFilterTerm, generateBaseQuery } from '.'

const defaultBaseQueryReturn = {
  from: 0,
  query: {
    bool: {
      filter: [
        { term: { _index: 'aquarius' } },
        { terms: { chainId: [1, 3] } },
        { term: { 'purgatory.state': false } },
        { bool: { must_not: [{ term: { 'nft.state': 5 } }] } }
        // { term: { 'services.type': 'access' } },
        // { term: { 'metadata.type': 'dataset' } }
      ]
    }
  },
  size: 1000
}

describe('@utils/aquarius', () => {
  test('escapeEsReservedCharacters', () => {
    expect(escapeEsReservedCharacters('<')).toBe('\\<')
  })

  test('getFilterTerm with string value', () => {
    expect(getFilterTerm('hello', 'world')).toStrictEqual({
      term: { hello: 'world' }
    })
  })

  test('getFilterTerm with array value', () => {
    expect(getFilterTerm('hello', ['world', 'domination'])).toStrictEqual({
      terms: { hello: ['world', 'domination'] }
    })
  })

  test('generateBaseQuery', () => {
    expect(generateBaseQuery({ chainIds: [1, 3] })).toStrictEqual(
      defaultBaseQueryReturn
    )
  })

  test('generateBaseQuery aggs are passed through', () => {
    expect(
      generateBaseQuery({ chainIds: [1, 3], aggs: 'hello world' })
    ).toStrictEqual({
      ...defaultBaseQueryReturn,
      aggs: 'hello world'
    })
  })

  test('generateBaseQuery sortOptions are passed through', () => {
    expect(
      generateBaseQuery({
        chainIds: [1, 3],
        sortOptions: {
          sortBy: SortTermOptions.Created,
          sortDirection: SortDirectionOptions.Ascending
        }
        // filters: [
        //   getFilterTerm('services.type', 'access'),
        //   getFilterTerm('metadata.type', 'dataset')
        // ]
      })
    ).toStrictEqual({
      ...defaultBaseQueryReturn,
      sort: {
        'nft.created': 'asc'
      }
    })
  })
})
