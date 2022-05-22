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
