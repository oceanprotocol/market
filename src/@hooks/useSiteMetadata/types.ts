export interface UseSiteMetadata {
  siteTitle: string
  siteTagline: string
  siteUrl: string
  siteIcon: string
  siteImage: string
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
    publisherMarketOrderFee: string
    publisherMarketPoolSwapFee: string
    publisherMarketFixedSwapFee: string
    consumeMarketOrderFee: string
    consumeMarketPoolSwapFee: string
    consumeMarketFixedSwapFee: string
    currencies: string[]
    portisId: string
    allowFixedPricing: string
    allowDynamicPricing: string
    allowFreePricing: string
    defaultPrivacyPolicySlug: string
    privacyPreferenceCenter: string
    darkModeConfig: {
      classNameDark: string
      classNameLight: string
      storageKey: string
    }
  }
}
