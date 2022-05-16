const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const webpack = require('webpack')
module.exports = {
  core: { builder: 'webpack5' },
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-essentials'],
  framework: '@storybook/react',
  webpackFinal: async (config) => {
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions
      })
    ]

    // Mimic next.config.js webpack config
    config.module.rules.push({
      test: /\.gif$/,
      // yay for webpack 5
      // https://webpack.js.org/guides/asset-management/#loading-images
      type: 'asset/resource'
    })

    // Modify storybook's file-loader rule to avoid conflicts with svgr
    const fileLoaderRule = config.module.rules.find(
      (rule) => rule.test && rule.test.test('.svg')
    )
    fileLoaderRule.exclude = /\.svg$/

    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.(tsx|ts)$/,
      use: [
        { loader: require.resolve('@svgr/webpack'), options: { icon: true } }
      ]
    })

    const fallback = config.resolve.fallback || {}
    Object.assign(fallback, {
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
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      })
    ])
    return config
  }
}
