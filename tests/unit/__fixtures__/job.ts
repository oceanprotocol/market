import { ComputeJob } from '@oceanprotocol/squid'

// ComputeJob need to be updated in squid
const job: Partial<ComputeJob> = {
  agreementId:
    'ccc60b8d33ae4986b224551b69f521761171159994474debbb5353f45286e206',
  algorithmLogUrl:
    'https://compute-publish.s3.amazonaws.com/605fb38b076844b7a2ee912b229a3f73/data/logs/algorithm.log',
  dateCreated: '1585828421.03217',
  dateFinished: '1585828541.73514',
  jobId: '605fb38b076844b7a2ee912b229a3f7333',
  owner: '0x4D156A2ef69ffdDC55838176C6712C90f60a2285',
  resultsUrls: [
    'https://compute-publish.s3.amazonaws.com/605fb38b076844b7a2ee912b229a3f73/data/outputs/output.log'
  ],
  status: 70,
  statusText: 'Job finished'
}

export default job
