module.exports = (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    webpack: (config, options) => {
      config.module.rules.push(
        {
          test: /\.svg$/,
          issuer: /\.(tsx|ts)$/,
          use: [{ loader: '@svgr/webpack', options: { icon: true } }]
        },
        {
          test: /\.gif$/,
          // yay for webpack 5
          // https://webpack.js.org/guides/asset-management/#loading-images
          type: 'asset/resource'
        }
      )
      // for old ocean.js, most likely can be removed later on
      config.plugins.push(
        new options.webpack.IgnorePlugin({
          resourceRegExp: /^electron$/
        })
      )
      const fallback = config.resolve.fallback || {}
      Object.assign(fallback, {
        // crypto: require.resolve('crypto-browserify'),
        // stream: require.resolve('stream-browserify'),
        // assert: require.resolve('assert'),
        // os: require.resolve('os-browserify'),
        // url: require.resolve('url'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        fs: false,
        crypto: false,
        os: false,
        stream: false,
        assert: false
      })
      config.resolve.fallback = fallback

      config.plugins = (config.plugins || []).concat([
        new options.webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer']
        })
      ])
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

    // Prefer loading of ES Modules over CommonJS
    // https://nextjs.org/blog/next-11-1#es-modules-support
    // experimental: { esmExternals: true }
  }

  return nextConfig
}
