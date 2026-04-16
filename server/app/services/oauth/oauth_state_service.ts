import encryption from '@adonisjs/core/services/encryption'
import { randomBytes } from 'node:crypto'

export interface OAuthState {
  userId: number
  platformId: number
  nonce: string
  redirectTo?: string
}

export class OAuthStateService {
  encode(state: OAuthState): string {
    return encryption.encrypt(JSON.stringify(state))
  }

  decode(encoded: string): OAuthState | null {
    try {
      const decrypted = encryption.decrypt<string>(encoded)
      if (!decrypted) return null
      return JSON.parse(decrypted) as OAuthState
    } catch {
      return null
    }
  }

  nonce(): string {
    return randomBytes(16).toString('hex')
  }
}

export const oauthStateService = new OAuthStateService()
