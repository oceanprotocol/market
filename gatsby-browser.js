import wrapPageElementWithStyles from './src/helpers/wrapPageElement'
export const wrapPageElement = wrapPageElementWithStyles

// IntersectionObserver polyfill for gatsby-image (Safari, IE)
if (typeof window.IntersectionObserver === 'undefined') {
  import('intersection-observer')
}
