import { useStaticQuery, graphql } from 'gatsby'

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

const query = graphql`
  {
    privacyJson {
      policies {
        policy
        date
        language
        params {
          updated
          dateFormat
          tocHeader
          languageLabel
        }
      }
    }
  }
`

export function usePrivacyMetadata(): UsePrivacyMetadata {
  const data = useStaticQuery(query)

  return { ...data.privacyJson }
}
