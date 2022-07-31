export class NotFoundError extends Error {
  constructor() {
    super("The page could not be found.")
    this.name = "NotFound"
  }
}

export class ClientError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ClientError"
  }
}
