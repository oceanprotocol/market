// .jest/mocks/connectkit.js

export const getDefaultClient = jest.fn(() => ({
  autoConnect: true,
  connectors: [],
  provider: {},
  webSocketProvider: {}
}))
