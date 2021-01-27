import wrapPageElementWithStyles from './src/helpers/wrapPageElement'
import wrapRootElementWithProviders from './src/helpers/wrapRootElement'

export const wrapPageElement = wrapPageElementWithStyles
export const wrapRootElement = wrapRootElementWithProviders

// IntersectionObserver polyfill for gatsby-image (Safari, IE)
// TO DO: EWAI COMMENTED OUT BROKE IN LATEST GATSBY UPDATE!:
//if (typeof window.IntersectionObserver === 'undefined') {
//    import ('intersection-observer')
//}