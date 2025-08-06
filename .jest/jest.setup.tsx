import '@testing-library/jest-dom/extend-expect'
import { jest } from '@jest/globals'
import './__mocks__/matchMedia'
import './__mocks__/hooksMocks'
import './__mocks__/connectkit'
// 👇 Add these lines to polyfill TextEncoder/TextDecoder
import { TextEncoder, TextDecoder } from 'util'

// 👇 Safely cast to any to bypass type mismatch in Node environment
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder as any
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder as any
}

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    route: '/',
    pathname: '/'
  }))
}))

// jest.mock('next/head', () => {
//   return {
//     __esModule: true,
//     default: ({ children }: { children: Array<React.ReactElement> }) => {
//       return <>{children}</>
//     }
//   }
// })
