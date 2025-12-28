import { Types } from 'mongoose'

declare global {
  namespace Express {
    interface User {
      id: Types.ObjectId | string
      roles?: string[]
    }

    interface Request {
      user?: User
    }
  }
}

export {}
