const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const nextConfig = require('../next.config')

console.log(nextConfig.webpack)
module.exports = {
  core: {
    builder: 'webpack5'
  },
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: '@storybook/react',
  webpackFinal: async (config) => {
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions
      })
    ]

    config.module.rules.push(
      {
        test: /\.svg$/,
        issuer: /\.(tsx|ts)$/,
        use: [
          { loader: require.resolve('@svgr/webpack'), options: { icon: true } }
        ]
      },
      {
        test: /\.gif$/,
        // yay for webpack 5
        // https://webpack.js.org/guides/asset-management/#loading-images
        type: 'asset/resource'
      }
    )

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

    return config
  }
}
