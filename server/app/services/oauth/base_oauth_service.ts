export interface OAuthTokens {
  accessToken: string
  refreshToken: string | null
  expiresAt: string | null
  scope: string | null
}

export interface OAuthProfile {
  providerUserId: string
  username: string
}

export abstract class BaseOAuthService {
  /**
   * Build the provider's authorization URL the user will be redirected to.
   */
  abstract getAuthorizationUrl(state: string): string

  /**
   * Exchange an authorization code for access/refresh tokens.
   */
  abstract exchangeCode(code: string): Promise<OAuthTokens>

  /**
   * Fetch the authenticated user's profile from the provider.
   */
  abstract getProfile(accessToken: string): Promise<OAuthProfile>
}
