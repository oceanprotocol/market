const path = require('path')
const axios = require('axios')
// const { config } = require('./src/config/ocean')

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    node: {
      // 'fs' fix for squid.js
      fs: 'empty'
    }
  })
}

exports.createPages = async ({ actions, reporter }) => {
  const { createPage } = actions
  // Query for all assets to use in creating pages.
  const result = await axios(
    `https://aquarius.marketplace.oceanprotocol.com/api/v1/aquarius/assets`
  )
  const assets = result.data.ids

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while querying Aquarius for all assets.`)
    return
  }

  // Create pages for each DID
  const assetDetailsTemplate = path.resolve(
    `src/components/templates/AssetDetails/index.tsx`
  )

  await assets.forEach(async (did) => {
    const path = `/asset/${did}`

    await createPage({
      path,
      component: assetDetailsTemplate,
      context: { did }
    })
  })
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
