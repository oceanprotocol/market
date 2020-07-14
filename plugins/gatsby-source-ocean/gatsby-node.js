const axios = require('axios')

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  { metadataStoreUri }
) => {
  const { createNode } = actions

  // Query for all assets to use in creating pages.
  const result = await axios(`${metadataStoreUri}/api/v1/aquarius/assets`)

  for (let i = 0; i < result.data.ids.length; i++) {
    const did = result.data.ids[i]

    const metadataResult = await axios(
      `${metadataStoreUri}/api/v1/aquarius/assets/metadata/${did}`
    )

    const metadata = {
      did,
      ...metadataResult.data.attributes
    }

    const nodeMeta = {
      id: createNodeId(did),
      parent: null,
      children: [],
      internal: {
        type: 'OceanAsset',
        contentDigest: createContentDigest(metadata),
        description: `All data sets queried from ${metadataStoreUri}`
      }
    }

    const node = {
      ...metadata,
      ...nodeMeta
    }

    await createNode(node)
  }
}
