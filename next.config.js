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
          use: [
            {
              loader: 'file-loader',
              options: {
                publicPath: `/_next/static/media/`,
                outputPath: `${options.isServer ? '../' : ''}static/media/`,
                name: '[name].[hash].[ext]'
              }
            }
          ]
        }
      )

      config.node.fs = 'empty'
      config.externals.push('got')

      // for webpack 5
      // config.resolve.fallback = {
      //   fs: false,
      //   crypto: false,
      //   os: false,
      //   stream: false,
      //   http: false,
      //   https: false
      // }

      return typeof defaultConfig.webpack === 'function'
        ? defaultConfig.webpack(config, options)
        : config
    },
    webpack5: false

    // Prefer loading of ES Modules over CommonJS
    // https://nextjs.org/blog/next-11-1#es-modules-support
    // experimental: { esmExternals: true }
  }

  return nextConfig
}
