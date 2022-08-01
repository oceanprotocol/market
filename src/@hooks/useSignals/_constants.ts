import { AssetSignalItem } from '@context/Signals/_types'

const nftSignalItems: AssetSignalItem[] = [
  {
    assetId: '0xtest',
    name: 'Rug Pull Index',
    description:
      'Potential rug pull possibility, social media and community speculation index',
    value: '45%'
  },
  {
    assetId: '0xtest2',
    name: 'Pump Cycle Index',
    description:
      'Likelihood of current value being due to a pump in market activity and speculation',
    value: '3.7%'
  },
  {
    assetId: '0xtest3',
    name: 'Security Index',
    description: 'Tested and audited review index for smart contract security',
    value: '45%'
  },
  {
    assetId: '0xtest4',
    name: 'Team Experience Index',
    description:
      'Founding team rating and review based on professional experience and current features and value creation, social media and community speculation index',
    value: '69%'
  },
  {
    assetId: '0xtest5',
    name: 'Blue Chip Index',
    description:
      'Potential for project to become a Bluechip data token pull possibility',
    value: '45%'
  }
]

export { nftSignalItems }
