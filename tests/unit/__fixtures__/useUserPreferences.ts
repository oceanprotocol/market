import { UserPreferencesValue } from '../../../src/providers/UserPreferences'

const useUserPreferences: UserPreferencesValue = {
  debug: false,
  currency: 'EUR',
  locale: 'de',
  chainIds: [1],
  bookmarks: [],
  privacyPolicySlug: '/privacy/en',
  showPPC: false,
  setChainIds: jest.fn(),
  setCurrency: jest.fn(),
  setPrivacyPolicySlug: jest.fn(),
  setDebug: jest.fn(),
  setShowPPC: jest.fn(),
  addBookmark: jest.fn(),
  removeBookmark: jest.fn()
}

export default useUserPreferences
