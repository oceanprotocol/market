// scripts/print-addresses.js
const { ConfigHelper } = require('@oceanprotocol/lib')

async function main() {
  const helper = new ConfigHelper()
  const cfg = await helper.getConfig(11155111) // Sepolia

  // Imprime lo que normalmente usaría el Market
  console.log({
    chainId: cfg.chainId,
    nftFactoryAddress: cfg.nftFactoryAddress,
    fixedRateExchangeAddress: cfg.fixedRateExchangeAddress,
    dispenserAddress: cfg.dispenserAddress,
    opfCommunityFeeCollector: cfg.opfCommunityFeeCollector,
    oceanTokenAddress: cfg.oceanTokenAddress,
    providerUri: cfg.providerUri,
    subgraphUri: cfg.subgraphUri,
    metadataCacheUri: cfg.metadataCacheUri
  })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
