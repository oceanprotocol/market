const createMarkdownPages = require('./gatsby/createMarkdownPages')
const execSync = require('child_process').execSync
const path = require('path')

// Write out repo metadata
execSync(`node ./scripts/write-repo-metadata > repo-metadata.json`, {
  stdio: 'inherit'
})

// Generate GraphQL typings for urql
// execSync(`npm run graphql:graphTypes`, { stdio: 'inherit' })

// Generate Apollo typings
execSync(`npm run apollo:codegen`, { stdio: 'inherit' })

// Fetch EVM networks metadata
execSync(
  `node ./scripts/write-networks-metadata > content/networks-metadata.json`,
  {
    stdio: 'inherit'
  }
)

exports.createPages = async ({ graphql, actions }) => {
  await createMarkdownPages(graphql, actions)
}

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions
  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  const handleClientSideOnlyAsset = page.path.match(/^\/asset/)
  const handleClientSideOnlyAccount = page.path.match(/^\/profile/)

  if (handleClientSideOnlyAsset) {
    page.matchPath = '/asset/*'
    // Update the page.
    createPage(page)
  } else if (handleClientSideOnlyAccount) {
    page.matchPath = '/profile/*'
    createPage(page)
  }
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
