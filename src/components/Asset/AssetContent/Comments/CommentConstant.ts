/* Format of meta comment and claim

{
  "metadata": 
    [ 
	{"TemplateType": "ClaimHistory",
    
        "Claim": "did",
        "Dataset": "did",
        "Algorithm": "did",
        "Comment": "Claim {0} is executed after algo {1} is executed om dataset {2}"
      },
      {"TemplateType": "ClaimHistory",
    
        "Claim": "did",
        "Dataset": "did",
        "Algorithm": "did",
        "Comment": "Claim {0} is executed after algo {1} is executed om dataset {2}"
      }
    ]
  }

  */

export enum MetaTemplateType {
  ClaimHistory,
  UserComment
}

export class CommentMetaDataItem {
  templatetype: MetaTemplateType
  dataset: string
  algorithm: string
  claim: string
  comment: string
  by: string
  time: number

  constructor(
    templatetype: MetaTemplateType,
    dataset: string,
    algorithm: string,
    claim: string,
    by: string,
    time: number
  ) {
    this.templatetype = templatetype
    this.dataset = dataset
    this.algorithm = algorithm
    this.claim = claim
    this.by = by
    this.time = time
    this.comment = `Claim ${this.claim} is executed after execution of algorithm ${this.algorithm} on dataset ${this.dataset}`
  }
}
export class CommentMetaData {
  metadata: CommentMetaDataItem[]
  constructor() {
    this.metadata = []
  }

  static fromJSON(json: string): CommentMetaData {
    // return Object.assign(new CommentMetaData(), d)
    if (json !== null && json !== '' && json !== undefined)
      return JSON.parse(json)
    return null
  }

  static addMeta(
    original: string,
    toadd: CommentMetaDataItem
  ): CommentMetaData {
    let meta = CommentMetaData.fromJSON(original)
    if (meta === null) meta = new CommentMetaData()
    meta.metadata.push(toadd)
    return meta
    // metaNFT.metadata.description = JSON.stringify(meta)
    // console.log(JSON.stringify(metaNFT.metadata.description))
  }
}
