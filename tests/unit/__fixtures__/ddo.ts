import { DDO } from '@oceanprotocol/lib'
import { MetaDataMarket } from '../../../src/@types/MetaData'

const ddo: Partial<DDO> = {
  '@context': 'https://w3id.org/did/v1',
  id: 'did:op:e6fda48e8d814d5d9655645aac3c046cc87528dbc1a9449799e579d7b83d1360',
  publicKey: [
    {
      id:
        'did:op:e6fda48e8d814d5d9655645aac3c046cc87528dbc1a9449799e579d7b83d1360',
      type: 'EthereumECDSAKey',
      owner: '0x610D9314EDF2ced7681BA1633C33fdb8cF365a12'
    }
  ],
  authentication: [
    {
      type: 'RsaSignatureAuthentication2018',
      publicKey:
        'did:op:e6fda48e8d814d5d9655645aac3c046cc87528dbc1a9449799e579d7b83d1360'
    }
  ],
  service: [
    {
      type: 'metadata',
      serviceEndpoint:
        'https://aquarius.pacific.dev-ocean.com/api/v1/aquarius/assets/ddo/did:op:e6fda48e8d814d5d9655645aac3c046cc87528dbc1a9449799e579d7b83d1360',
      attributes: {
        main: {
          type: 'dataset',
          name: 'What a Waste Global Database',
          dateCreated: '2018-09-20T08:38:58',
          datePublished: '2019-12-11T05:19:42',
          author: 'World Development Indicators, The World Bank',
          license: 'CC-BY 4.0',
          price: '100000000000000000000',
          files: [
            {
              index: 0,
              contentType: 'csv',
              contentLength: '114000',
              url: ''
            },
            {
              index: 1,
              contentType: 'excel',
              contentLength: '219000',
              url: ''
            },
            {
              index: 2,
              contentType: 'csv',
              contentLength: '1300000',
              url: ''
            },
            {
              index: 3,
              contentType: 'csv',
              contentLength: '36300',
              url: ''
            }
          ]
        },
        additionalInformation: {
          description:
            'What a Waste is a global project to aggregate data on solid waste management from around the world. This database features the statistics collected through the effort, covering nearly all countries and over 330 cities. The metrics included cover all steps from the waste management value chain, including waste generation, composition, collection, and disposal, as well as information on user fees and financing, the informal sector, administrative structures, public communication, and legal information. The information presented is the best available based on a study of current literature and limited conversations with waste agencies and authorities. While there may be variations in the definitions and quality of reporting for individual data points, general trends should reflect the global reality. All sources and any estimations are noted.',
          copyrightHolder: 'World Bank Group',
          tags: ['Sustainability', ' Climate', ' Energy', ' ai-for-good'],
          links: [
            {
              name: 'Hello',
              url: 'https://demo.com'
            }
          ],
          termsAndConditions: true,
          access: 'Download'
        },
        curation: {
          numVotes: 100,
          rating: 5
        }
      } as MetaDataMarket,
      index: 0
    },
    {
      type: 'authorization',
      serviceEndpoint: 'https://secret-store.pacific.oceanprotocol.com',
      attributes: {
        main: {}
      },
      index: 2
    },
    {
      type: 'access',
      serviceEndpoint:
        'https://brizo.pacific.dev-ocean.com/api/v1/brizo/services/consume',
      attributes: {
        serviceAgreementTemplate: {
          contractName: 'EscrowAccessSecretStoreTemplate',
          events: [
            {
              name: 'AgreementCreated',
              actorType: 'consumer',
              handler: {
                moduleName: 'escrowAccessSecretStoreTemplate',
                functionName: 'fulfillLockRewardCondition',
                version: '0.1'
              }
            }
          ],
          fulfillmentOrder: [
            'lockReward.fulfill',
            'accessSecretStore.fulfill',
            'escrowReward.fulfill'
          ],
          conditionDependency: {
            lockReward: [],
            accessSecretStore: [],
            escrowReward: ['lockReward', 'accessSecretStore']
          },
          conditions: [
            {
              name: 'lockReward',
              timelock: 0,
              timeout: 0,
              contractName: 'LockRewardCondition',
              functionName: 'fulfill',
              events: [
                {
                  name: 'Fulfilled',
                  actorType: 'publisher',
                  handler: {
                    moduleName: 'lockRewardCondition',
                    functionName: 'fulfillAccessSecretStoreCondition',
                    version: '0.1'
                  }
                }
              ],
              parameters: [
                {
                  name: '_rewardAddress',
                  type: 'address',
                  value: '0x656Aa3D9b37A6eA770701ae2c612f760d9254A66'
                },
                {
                  name: '_amount',
                  type: 'uint256',
                  value: '0'
                }
              ]
            },
            {
              name: 'accessSecretStore',
              timelock: 0,
              timeout: 0,
              contractName: 'AccessSecretStoreCondition',
              functionName: 'fulfill',
              events: [
                {
                  name: 'Fulfilled',
                  actorType: 'publisher',
                  handler: {
                    moduleName: 'accessSecretStore',
                    functionName: 'fulfillEscrowRewardCondition',
                    version: '0.1'
                  }
                },
                {
                  name: 'TimedOut',
                  actorType: 'consumer',
                  handler: {
                    moduleName: 'accessSecretStore',
                    functionName: 'fulfillEscrowRewardCondition',
                    version: '0.1'
                  }
                }
              ],
              parameters: [
                {
                  name: '_documentId',
                  type: 'bytes32',
                  value:
                    'e6fda48e8d814d5d9655645aac3c046cc87528dbc1a9449799e579d7b83d1360'
                },
                {
                  name: '_grantee',
                  type: 'address',
                  value: ''
                }
              ]
            },
            {
              name: 'escrowReward',
              timelock: 0,
              timeout: 0,
              contractName: 'EscrowReward',
              functionName: 'fulfill',
              events: [
                {
                  name: 'Fulfilled',
                  actorType: 'publisher',
                  handler: {
                    moduleName: 'escrowRewardCondition',
                    functionName: 'verifyRewardTokens',
                    version: '0.1'
                  }
                }
              ],
              parameters: [
                {
                  name: '_amount',
                  type: 'uint256',
                  value: '0'
                },
                {
                  name: '_receiver',
                  type: 'address',
                  value: ''
                },
                {
                  name: '_sender',
                  type: 'address',
                  value: ''
                },
                {
                  name: '_lockCondition',
                  type: 'bytes32',
                  value: ''
                },
                {
                  name: '_releaseCondition',
                  type: 'bytes32',
                  value: ''
                }
              ]
            }
          ]
        },
        additionalInformation: {
          description: ''
        },
        main: {
          name: 'dataAssetAccessServiceAgreement',
          creator: '',
          datePublished: '2019-12-11T05:19:42Z',
          price: '',
          timeout: 36000
        }
      },
      index: 3
    }
  ],
  created: '2019-06-26T14:53:09',
  proof: {
    type: 'DDOIntegritySignature',
    created: '2019-06-26T14:53:14Z',
    creator: '0x610D9314EDF2ced7681BA1633C33fdb8cF365a12',
    signatureValue:
      '0x989cda083ff1711f885bf0fa95a149654edb07da7698b8f4bb3482788b1960f562aa265259767de8ed03a1d1bdaa1885cf42c5a41ec33145e84975ae7444f0d91b'
  }
}

export default ddo
