export interface ComputeJobMetaData {
  jobId: string
  did: string
  dateCreated: string
  dateFinished: string
  assetName: string
  status: number
  statusText: string
  algorithmLogUrl: string
  resultsUrls: string[]
}
