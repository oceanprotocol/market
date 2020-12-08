import { ConfigHelper } from '@oceanprotocol/lib'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'

export default function getAddressesForMain(): Partial<ConfigHelperConfig> {
  return new ConfigHelper().getAddressesFromEnv('mainnet')
}
