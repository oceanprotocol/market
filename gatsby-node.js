const path = require('path')

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    node: {
      // 'fs' fix for squid.js
      fs: 'empty'
    }
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // Create pages for all assets
  const assetDetailsTemplate = path.resolve(
    'src/components/templates/AssetDetails.tsx'
  )

  const result = await graphql(`
    query {
      allOceanAsset {
        edges {
          node {
            did
            main {
              type
              name
              dateCreated
              author
              license
              price
              datePublished
              files {
                contentType
                index
              }
            }
            additionalInformation {
              description
              deliveryType
              termsAndConditions
              access
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  await result.data.allOceanAsset.edges.forEach(({ node }) => {
    const path = `/asset/${node.did}`

    createPage({
      path,
      component: assetDetailsTemplate,
      context: { did: node.did }
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
