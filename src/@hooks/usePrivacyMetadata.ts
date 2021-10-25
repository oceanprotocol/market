import privacyContent from '../../content/pages/privacy/policies.json'

export interface UsePrivacyMetadata {
  policies: {
    policy: string
    language: string
    date: string
    params: {
      languageLabel: string
      tocHeader: string
      updated: string
      dateFormat: string
    }
  }[]
}

export function usePrivacyMetadata(): UsePrivacyMetadata {
  return { ...privacyContent }
}
