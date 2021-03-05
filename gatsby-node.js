const path = require('path')
const createFields = require('./gatsby/createFields')
const createMarkdownPages = require('./gatsby/createMarkdownPages')
const execSync = require('child_process').execSync

// Write out repo metadata
execSync(`node ./scripts/write-repo-metadata > repo-metadata.json`, {
  stdio: 'inherit'
})

// Generate Apollo typings
execSync(`npm run apollo:codegen`, { stdio: 'inherit' })

// Fetch EVM networks metadata
execSync(
  `node ./scripts/write-networks-metadata > content/networks-metadata.json`,
  {
    stdio: 'inherit'
  }
)

exports.onCreateNode = ({ node, actions, getNode }) => {
  createFields(node, actions, getNode)
}

exports.createPages = async ({ graphql, actions }) => {
  await createMarkdownPages(graphql, actions)
}

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions
  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  const handleClientSideOnly = page.path.match(/^\/asset/)

  if (handleClientSideOnly) {
    page.matchPath = '/asset/*'

    // Update the page.
    createPage(page)
  }
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    node: {
      // 'fs' fix for squid.js
      fs: 'empty'
    },
    // fix for 'got'/'swarm-js' dependency
    externals: ['got'],

    // fix for being able to use `npm link` with @oceanprotocol/react
    // see https://github.com/facebook/react/issues/13991
    resolve: {
      alias: {
        react: path.resolve('./node_modules/react')
      }
    }
  })
}
