import { asset } from '../../__fixtures__/assetWithAccessDetails'

export const getAccessDetailsForAssets = jest
  .fn()
  .mockResolvedValue([asset, asset, asset, asset, asset, asset])
