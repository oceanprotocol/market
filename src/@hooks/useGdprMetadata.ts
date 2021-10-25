import gdprContent from '../../content/gdpr.json'

export interface UseGdprMetadata {
  title: string
  text: string
  accept: string
  reject: string
  close: string
  configure: string
  placeholder?: string
  optionalCookies?: {
    title: string
    desc: string
    cookieName: string
  }[]
}

export function useGdprMetadata(): UseGdprMetadata {
  return { ...gdprContent }
}
