import initStoryshots from '@storybook/addon-storyshots'
import { render, wait } from '@testing-library/react'
import oceanMock from './__mocks__/ocean-mock'
import web3ProviderMock from './__mocks__/web3'

// eslint-disable-next-line
jest.mock('@oceanprotocol/react', () => ({
  useOcean: () => {
    return {
      ocean: oceanMock
    }
  },
  useWeb3: () => {
    return {
      web3: web3ProviderMock,
      account: '0x0000000011111111aaaaaaaabbbbbbbb22222222',
      ethProviderStatus: 1
    }
  },
  useConsume: () => {
    return {
      consume: () => null as any,
      consumeStepText: '',
      isLoading: false
    }
  },
  useMetadata: () => {
    return {
      getCuration: () => {
        return Promise.resolve({ rating: 0, numVotes: 0 })
      }
    }
  }
}))
// jest.mock('@oceanprotocol/squid')

// Stories are render-tested with @testing-library/react,
// overwriting default snapshot testing behavior

// eslint-disable-next-line
jest.mock('@oceanprotocol/react', () => ({
  useOcean: () => {
    return {
      ocean: oceanMock
    }
  },
  useWeb3: () => {
    return {
      web3: web3ProviderMock,
      account: '0x0000000011111111aaaaaaaabbbbbbbb22222222',
      ethProviderStatus: 1
    }
  },
  useConsume: () => {
    return {
      consume: () => null as any,
      consumeStepText: '',
      isLoading: false
    }
  },
  useCompute: () => {
    return {
      compute: () => null as any,
      isLoading: false,
      computeStepText: 0,
      computeError: ''
    }
  },
  useMetadata: () => {
    return {
      getCuration: () => {
        return Promise.resolve({ rating: 0, numVotes: 0 })
      }
    }
  },
  computeOptions: ['', '']
}))

initStoryshots({
  asyncJest: true,
  test: async ({ story, done }) => {
    const storyElement = story.render()

    // render the story with @testing-library/react
    render(storyElement)
    await wait(() => done())
  }
})
