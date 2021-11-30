import wordListDefault from './words.json'

export interface DataTokenOptions {
  cap?: string
  name?: string
  symbol?: string
}

/**
 * Generate new datatoken name & symbol from a word list
 * @return {<{ name: String; symbol: String }>} datatoken name & symbol. Produces e.g. "Endemic Jellyfish Token" & "ENDJEL-45"
 */
export function generateDatatokenName(wordList?: {
  nouns: string[]
  adjectives: string[]
}): {
  name: string
  symbol: string
} {
  const list = wordList || wordListDefault
  const random1 = Math.floor(Math.random() * list.adjectives.length)
  const random2 = Math.floor(Math.random() * list.nouns.length)
  const indexNumber = Math.floor(Math.random() * 100)

  // Capitalized adjective & noun
  const adjective = list.adjectives[random1].replace(/^\w/, (c) =>
    c.toUpperCase()
  )
  const noun = list.nouns[random2].replace(/^\w/, (c) => c.toUpperCase())

  const name = `${adjective} ${noun} Token`
  // use first 3 letters of name, uppercase it, and add random number
  const symbol = `${(
    adjective.substring(0, 3) + noun.substring(0, 3)
  ).toUpperCase()}-${indexNumber}`

  return { name, symbol }
}
