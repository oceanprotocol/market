// TODO: can be better
export const orderFeedback: { [key in number]: string } = {
  0: 'Buying one datatoken from pool',
  1: 'Approving OCEAN and ordering asset',
  2: 'Generating signature to access download url'
}

// TODO: customize for compute
export const computeFeedback: { [key in number]: string } = {
  0: 'Ordering asset...',
  1: 'Transfering data token.',
  2: 'Access granted. Starting job...'
}
