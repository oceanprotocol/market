import { DDO } from '@oceanprotocol/lib'

const ddo: Partial<DDO> = {
  '@context': 'https://w3id.org/did/v1',
  id: 'did:op:7b4e90b05ec243dbaaca2a503fdde119706577f9645b45b9ab65cf2c3970f757',
  publicKey: [
    {
      id:
        'did:op:7b4e90b05ec243dbaaca2a503fdde119706577f9645b45b9ab65cf2c3970f757',
      type: 'EthereumECDSAKey',
      owner: '0x4D156A2ef69ffdDC55838176C6712C90f60a2285'
    }
  ],
  authentication: [
    {
      type: 'RsaSignatureAuthentication2018',
      publicKey:
        'did:op:7b4e90b05ec243dbaaca2a503fdde119706577f9645b45b9ab65cf2c3970f757'
    }
  ],
  service: [
    {
      type: 'metadata',
      attributes: {
        main: {
          type: 'dataset',
          name: 'Endangered coral reefs',
          dateCreated: '2020-09-21T09:58:35Z',
          author: 'me',
          license:
            'CC BY-NC-SA: Attribution-NonCommercial-ShareAlike 4.0 International',
          files: [
            {
              contentLength: '1256',
              contentType: 'text/html',
              index: 0
            }
          ],
          datePublished: '2020-09-21T09:59:07Z'
        },
        additionalInformation: {
          description: 'test',
          copyrightHolder: '',
          tags: ['coral'],
          links: [
            {
              contentLength: '1256',
              contentType: 'text/html',
              url: 'https://www.example.com'
            }
          ],
          termsAndConditions: true,
          priceType: 'fixed'
        }
      },
      index: 0
    },
    {
      type: 'access',
      index: 1,
      serviceEndpoint:
        'https://provider.rinkeby.v3.dev-ocean.com/api/v1/services/consume',
      attributes: {
        main: {
          creator: '0x4D156A2ef69ffdDC55838176C6712C90f60a2285',
          datePublished: '2020-09-21T09:58:35Z',
          cost: '1000000000000000000',
          timeout: 0,
          name: 'dataAssetAccess'
        }
      }
    }
  ],
  dataToken: '0x932c3937cBc983790e67A258Cb6F8959F2466407',
  created: '2020-09-21T09:59:01Z',
  proof: {
    created: '2020-09-21T09:59:06Z',
    creator: '0x4D156A2ef69ffdDC55838176C6712C90f60a2285',
    type: 'DDOIntegritySignature',
    signatureValue:
      '0xc2157630d4f15d1575f1320ee1ea8007c750e8b06f5866941cc8372596cde39424dff2a75c2b9ac16683add2c2d1972f77953f207239191c7a48af64c4deb8c21c'
  },
  updated: '2020-09-21T09:59:01Z'
}

export default ddo
