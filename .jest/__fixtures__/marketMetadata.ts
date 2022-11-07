import siteContent from '../../content/site.json'
import appConfig from '../../app.config'

export default {
  getOpcFeeForToken: jest.fn(),
  siteContent,
  appConfig,
  opcFees: [
    {
      chainId: 1,
      approvedTokens: [
        '0x0642026e7f0b6ccac5925b4e7fa61384250e1701',
        '0x967da4048cd07ab37855c090aaf366e4ce1b9f48'
      ],
      swapApprovedFee: '0.001',
      swapNotApprovedFee: '0.002'
    },
    {
      chainId: 137,
      approvedTokens: [
        '0x282d8efce846a88b159800bd4130ad77443fa1a1',
        '0xc5248aa0629c0b2d6a02834a5f172937ac83cbd3'
      ],
      swapApprovedFee: '0.001',
      swapNotApprovedFee: '0.002'
    },
    {
      chainId: 56,
      approvedTokens: ['0xdce07662ca8ebc241316a15b611c89711414dd1a'],
      swapApprovedFee: '0.001',
      swapNotApprovedFee: '0.002'
    },
    {
      chainId: 246,
      approvedTokens: ['0x593122aae80a6fc3183b2ac0c4ab3336debee528'],
      swapApprovedFee: '0.001',
      swapNotApprovedFee: '0.002'
    },
    {
      chainId: 1285,
      approvedTokens: ['0x99c409e5f62e4bd2ac142f17cafb6810b8f0baae'],
      swapApprovedFee: '0.001',
      swapNotApprovedFee: '0.002'
    },
    {
      chainId: 3,
      approvedTokens: ['0x5e8dcb2afa23844bcc311b00ad1a0c30025aade9'],
      swapApprovedFee: '0.001',
      swapNotApprovedFee: '0.002'
    },
    {
      chainId: 4,
      approvedTokens: [
        '0x8967bcf84170c91b0d24d4302c2376283b0b3a07',
        '0xd92e713d051c37ebb2561803a3b5fbabc4962431'
      ],
      swapApprovedFee: '0.001',
      swapNotApprovedFee: '0.002'
    },
    {
      chainId: 80001,
      approvedTokens: ['0xd8992ed72c445c35cb4a2be468568ed1079357c8'],
      swapApprovedFee: '0.001',
      swapNotApprovedFee: '0.002'
    },
    {
      chainId: 1287,
      approvedTokens: ['0xf6410bf5d773c7a41ebff972f38e7463fa242477'],
      swapApprovedFee: '0.001',
      swapNotApprovedFee: '0.002'
    }
  ]
}
