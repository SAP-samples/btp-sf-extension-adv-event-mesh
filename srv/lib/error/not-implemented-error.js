export default class NotImplementedError extends Error {
  constructor (message = 'Not Found') {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
    this.code = 501
  }
}
