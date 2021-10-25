const createMarkdownPages = require('./gatsby/createMarkdownPages')
const execSync = require('child_process').execSync
const path = require('path')

exports.createPages = async ({ graphql, actions }) => {
  await createMarkdownPages(graphql, actions)
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, 'src/components/@shared'),
        '@hooks': path.resolve(__dirname, 'src/@hooks'),
        '@context': path.resolve(__dirname, 'src/@context'),
        '@images': path.resolve(__dirname, 'src/@images'),
        '@utils': path.resolve(__dirname, 'src/@utils')
      }
    },
    node: {
      // 'fs' fix for ocean.js
      fs: 'empty'
    },
    // fix for 'got'/'swarm-js' dependency
    externals: ['got']
  })
}
