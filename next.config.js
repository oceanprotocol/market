import withTM from 'next-transpile-modules'
import { fileURLToPath } from 'url'
import path from 'path'
import pkg from 'webpack'
const { ProvidePlugin, IgnorePlugin } = pkg

// Resolve __dirname for ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = (phase, { defaultConfig }) => {
  const config = {
    experimental: {
      esmExternals: 'loose'
    },
    webpack: (config, options) => {
      config.module.rules.push(
        {
          test: /\.svg$/,
          issuer: /\.(tsx|ts)$/,
          use: [{ loader: '@svgr/webpack', options: { icon: true } }]
        },
        {
          test: /\.gif$/,
          type: 'asset/resource'
        }
      )

      // Ignore electron imports
      config.plugins.push(
        new IgnorePlugin({
          resourceRegExp: /^electron$/
        })
      )

      // Configure resolve.fallback
      const fallback = config.resolve.fallback || {}
      Object.assign(fallback, {
        http: path.resolve(__dirname, 'node_modules/stream-http'),
        https: path.resolve(__dirname, 'node_modules/https-browserify'),
        fs: false,
        crypto: false,
        os: false,
        stream: false,
        assert: false,
        tls: false,
        net: false
      })
      config.resolve.fallback = fallback

      // Provide process and Buffer
      config.plugins = (config.plugins || []).concat([
        new ProvidePlugin({
          process: path.resolve(__dirname, 'node_modules/process/browser'),
          Buffer: [path.resolve(__dirname, 'node_modules/buffer'), 'Buffer']
        })
      ])

      // Apply defaultConfig.webpack if it’s a function
      return typeof defaultConfig.webpack === 'function'
        ? defaultConfig.webpack(config, options)
        : config
    },
    async redirects() {
      return [
        {
          source: '/publish',
          destination: '/publish/1',
          permanent: true
        }
      ]
    }
  }

  return withTM(['@oceanprotocol/lib', '@oceanprotocol/ddo-js'])(config)
}

export default nextConfig
