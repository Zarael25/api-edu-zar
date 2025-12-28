export default abstract class BaseError<
  TName extends string,
  TCode extends string,
> extends Error {
  public readonly name: TName
  public readonly code: TCode
  public readonly status: number

  constructor(params: {
    name: TName
    message: string
    code: TCode
    status: number
  }) {
    super(params.message)

    this.name = params.name
    this.code = params.code
    this.status = params.status

    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this)
  }
}
