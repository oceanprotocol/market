import { ConfigHelper, Config } from '@oceanprotocol/lib'

export function getOceanConfig(): Config {
  return new ConfigHelper().getConfig(process.env.GATSBY_NETWORK || 'rinkeby')
}
