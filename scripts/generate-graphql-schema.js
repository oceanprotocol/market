#!/usr/bin/env node
'use strict'

const fs = require('fs')
const axios = require('axios')
const { getIntrospectionQuery } = require('graphql/utilities')
const { generateTypeScriptTypes } = require('graphql-schema-typescript')

generateGraphSchema()

async function generateGraphSchema() {
  const query = JSON.stringify({
    query: getIntrospectionQuery({ descriptions: false })
  })
  const response = await axios.post(
    'https://subgraph.rinkeby.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph',
    query
  )
  generateTypeScriptTypes(response.data.data, './src/@types/schema.json')
  // fs.writeFileSync('./src/@types/schema.json', JSON.stringify(response.data))
}
