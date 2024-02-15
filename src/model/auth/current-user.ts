import { type User } from '../user/user'

export interface CredentialUser {
  access_token: string
  user: User
}
