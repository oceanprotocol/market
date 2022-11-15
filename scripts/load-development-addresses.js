const fs = require('fs')
const os = require('os')

function getLocalAddresses() {
  const data = JSON.parse(
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.readFileSync(
      `${os.homedir}/.ocean/ocean-contracts/artifacts/address.json`,
      'utf8'
    )
  )
  return data.development
}

const addresses = getLocalAddresses()
const envVars = []
envVars.push(`NEXT_PUBLIC_NFT_FACTORY_ADDRESS='${addresses.ERC721Factory}'`)
envVars.push(
  `NEXT_PUBLIC_OPF_COMMUNITY_FEE_COLECTOR='${addresses.OPFCommunityFeeCollector}'`
)
envVars.push(
  `NEXT_PUBLIC_FIXED_RATE_EXCHANGE_ADDRESS='${addresses.FixedPrice}'`
)
envVars.push(`NEXT_PUBLIC_DISPENSER_ADDRESS='${addresses.Dispenser}'`)
envVars.push(`NEXT_PUBLIC_OCEAN_TOKEN_ADDRESS='${addresses.Ocean}'`)
envVars.push(`NEXT_PUBLIC_MARKET_DEVELOPMENT='true'`)

/*
 check this on oceanjs and move thinks there as well if not exposed
*/
envVars.push(`NEXT_PUBLIC_METADATACACHE_URI='http://127.0.0.1:5000'`)
envVars.push(`NEXT_PUBLIC_SUBGRAPH_URI='http://127.0.0.1:9000'`)
envVars.push(`NEXT_RBAC_URL='http://127.0.0.1:3000'`)

var stream = fs.createWriteStream('.env', { flags: 'a' })

envVars.forEach((envVar) => {
  stream.write('\n' + envVar)
})
stream.end()
