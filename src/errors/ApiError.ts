import BaseError from './BaseError'
import type { ErrorName, ErrorCode } from '../types'

// Clase ApiError que extiende de BaseError
class ApiError extends BaseError<ErrorName, ErrorCode> {}
export default ApiError
