/**
 * @param { Promise } promise
 * @param {object} errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to<Value, U = Error>(
  promise: Promise<Value>,
  errorExt?: object,
): Promise<[null, U] | [Value]> {
  return promise
    .then<[Value]>((data: Value) => [data])
    .catch<[null, U]>((err: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt)
        return [null, parsedError]
      }

      return [null, err]
    })
}
