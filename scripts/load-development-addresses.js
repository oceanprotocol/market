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

function updateEnvVariable(key, value) {
  fs.readFile('.env', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    const lines = data.split('\n')

    let keyExists = false
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.startsWith(key + '=')) {
        lines[i] = `${key}=${value}`
        keyExists = true
        break
      }
    }

    if (!keyExists) {
      lines.push(`${key}=${value}`)
    }

    const updatedContent = lines.join('\n')
    fs.writeFile('.env', updatedContent, 'utf8', (err) => {
      if (err) {
        console.error(err)
        return
      }
      console.log(
        `Successfully ${
          keyExists ? 'updated' : 'added'
        } the ${key} environment variable.`
      )
    })
  })
}

const addresses = getLocalAddresses()
updateEnvVariable('NEXT_PUBLIC_NFT_FACTORY_ADDRESS', addresses.ERC721Factory)
updateEnvVariable(
  'NEXT_PUBLIC_OPF_COMMUNITY_FEE_COLECTOR',
  addresses.OPFCommunityFeeCollector
)
updateEnvVariable(
  'NEXT_PUBLIC_FIXED_RATE_EXCHANGE_ADDRESS',
  addresses.FixedPrice
)
updateEnvVariable('NEXT_PUBLIC_DISPENSER_ADDRESS', addresses.Dispenser)
updateEnvVariable('NEXT_PUBLIC_OCEAN_TOKEN_ADDRESS', addresses.Ocean)
updateEnvVariable('NEXT_PUBLIC_MARKET_DEVELOPMENT', true)
updateEnvVariable(
  '#NEXT_PUBLIC_PROVIDER_URL',
  '"http://127.0.0.1:8030" # only for mac'
)
updateEnvVariable(
  `#NEXT_PUBLIC_SUBGRAPH_URI',"http://127.0.0.1:9000" # only for mac`
)
updateEnvVariable(
  '#NEXT_PUBLIC_METADATACACHE_URI',
  '"http://127.0.0.1:5000" # only for mac'
)
