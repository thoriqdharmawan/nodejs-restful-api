import { ResponseError } from "../error/response-error.js"

const validate = (schema, request) => {
  const result = schema.validate(request)

  if (result.error) {
    throw new ResponseError(400, result.error.messaage)
  } else {
    return result.validate
  }
}

export {
  validate
}