import { type User } from '../user/user'

export interface CredentialUser {
  access_token: string
  refresh_token: string
  user: User
}
