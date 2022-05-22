// Taken from here https://stackoverflow.com/a/55128956/186334
// Useful to make function overloads from union from mapped type
export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never
