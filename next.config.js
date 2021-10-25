// const path = require('path')

module.exports = (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    webpack: (config, options) => {
      config.module.rules.push(
        {
          test: /\.svg$/,
          use: [{ loader: '@svgr/webpack', options: { icon: true } }]
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: ['file-loader']
        }
      )

      config.node.fs = 'empty'

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
  }

  return nextConfig
}
