import '@testing-library/jest-dom/extend-expect'
import { jest } from '@jest/globals'
import './__mocks__/matchMedia'
import './__mocks__/hooksMocks'

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
