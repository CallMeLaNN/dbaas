export const isObject = (obj: unknown): obj is Record<PropertyKey, unknown> => {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj)
}

export const isKeyValue = (obj: unknown): obj is Record<string, string> => {
  return (
    isObject(obj) &&
    Object.entries(obj).every(
      ([key, value]) => typeof key === "string" && typeof value === "string",
    )
  )
}

export function hasProperty<
  T extends Record<PropertyKey, unknown>,
  K extends PropertyKey,
>(value: T, propertyName: K): value is Record<K, unknown> & T {
  return propertyName in value
}

// Taken from here https://stackoverflow.com/a/55128956/186334
// Useful to make function overloads from union from mapped type
export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never
