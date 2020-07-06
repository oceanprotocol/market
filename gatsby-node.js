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
  assets.forEach((did) => {
    const path = `/asset/${did}`

    createPage({
      path,
      component: assetDetailsTemplate,
      context: { did }
    })
  })
}
