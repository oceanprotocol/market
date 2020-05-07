const webpack = require('webpack')
require('dotenv').config()

// Returns environment variables as an object
const env = Object.keys(process.env).reduce((acc, curr) => {
  acc[`process.env.${curr}`] = JSON.stringify(process.env[curr])
  return acc
}, {})

const withSvgr = (nextConfig = {}) => ({
  webpack(config, options) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true
          }
        }
      ]
    })

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options)
    }

    return config
  }
})

// eslint-disable-next-line no-unused-vars
const withFsFix = (nextConfig = {}) => ({
  webpack(config, options) {
    // Fixes npm packages that depend on `fs` module
    // https://github.com/zeit/next.js/issues/7755#issuecomment-508633125
    // or https://github.com/zeit/next.js/issues/7755
    if (!options.isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options)
    }

    return config
  }
})

const withGlobalConstants = (nextConfig = {}) => ({
  webpack(config, options) {
    // Allows to create global constants which can be configured at compile
    // time (in this case they are the environment variables)
    config.plugins.push(new webpack.DefinePlugin(env))

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options)
    }

    return config
  }
})

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const withMarkdown = (nextConfig = {}) => ({
  webpack(config, options) {
    config.module.rules.push({
      test: /\.md$/,
      loader: 'raw-loader'
    })

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options)
    }

    return config
  }
})

module.exports = withBundleAnalyzer(
  withSvgr(
    withFsFix(
      withMarkdown(
        withGlobalConstants({
          exportPathMap: (defaultPathMap, { dev }) => {
            // In dev environment return defaultPathMas as it is
            if (dev) {
              return defaultPathMap
            }

            // pages we know about beforehand
            const paths = {
              '/': { page: '/' },
              '/publish': { page: '/publish' },
              '/explore': { page: '/explore' }
            }

            return paths
          }
        })
      )
    )
  )
)
