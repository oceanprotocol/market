const Router = require('next/router')

Router.router = {
  push: () => null,
  prefetch: () => null,
  asPath: '/hello',
  events: {
    on: () => null,
    off: () => null
  },
  useRouter: () => {
    return {
      push: () => null,
      prefetch: () => null,
      asPath: '/hello',
      events: {
        on: () => null,
        off: () => null
      }
    }
  }
}

module.exports = Router.router
