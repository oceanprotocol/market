export interface UseSiteMetadata {
  siteTitle: string
  siteTagline: string
  siteUrl: string
  siteIcon: string
  siteImage: { childImageSharp: { original: { src: string } } }
  copyright: string
  menu: {
    name: string
    link: string
  }[]
  warning: {
    main: string
    polygonPublish: string
  }
  announcement: {
    main: string
    polygon: string
  }
  appConfig: {
    metadataCacheUri: string
    infuraProjectId: string
    chainIds: number[]
    chainIdsSupported: number[]
    marketFeeAddress: string
    currencies: string[]
    portisId: string
    allowFixedPricing: string
    allowDynamicPricing: string
    allowFreePricing: string
    allowAdvancedSettings: string
    credentialType: string
    defaultPrivacyPolicySlug: string
    privacyPreferenceCenter: string
    allowAdvancedPublishSettings: string
    rbacUrl: string
    darkModeConfig: {
      classNameDark: string
      classNameLight: string
      storageKey: string
    }
  }
}
