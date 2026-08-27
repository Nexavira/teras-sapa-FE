/**
 * Get value of object by dynamic path
 * @param {Record<string, any>} object - The object to get the value from.
 * @param {string} path - The path to the value.
 * @returns {any} The value.
 * @example
 * getValueByPath({ a: { b: { c: 1 } } }, 'a.b.c') // 1
 */
export function getValueByPath(obj: any, path: string): any {
  if (!obj || !path) return undefined

  const keys = path.split('.')
  let result = obj

  for (const key of keys) {
    if (result === undefined || result === null) return undefined
    result = result[key]
  }

  return result
}
