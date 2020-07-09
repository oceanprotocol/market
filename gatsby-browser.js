import wrapPageElementWithStyles from './src/helpers/wrapPageElement'
import wrapRootElementWithProviders from './src/helpers/wrapRootElement'

export const wrapPageElement = wrapPageElementWithStyles
export const wrapRootElement = wrapRootElementWithProviders

// IntersectionObserver polyfill for gatsby-image (Safari, IE)
if (typeof window.IntersectionObserver === 'undefined') {
  import('intersection-observer')
}
