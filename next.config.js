module.exports = (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    webpack: (config, options) => {
      config.plugins.push(
        new options.webpack.IgnorePlugin({
          resourceRegExp: /^electron$/
        })
      )
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
      config.resolve.fallback = {
        fs: false,
        crypto: false,
        os: false,
        stream: false,
        http: false,
        https: false
      }

      return typeof defaultConfig.webpack === 'function'
        ? defaultConfig.webpack(config, options)
        : config
    }

    // Prefer loading of ES Modules over CommonJS
    // https://nextjs.org/blog/next-11-1#es-modules-support
    // experimental: { esmExternals: true }
  }

  return nextConfig
}
