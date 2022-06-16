interface PoolBalance {
  baseToken: string
  datatoken: string
}

interface UserBalance {
  eth: string
  ocean: string
  [key: string]: string
}
