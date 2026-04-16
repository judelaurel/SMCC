import SocialAccount from '#models/social_account'
import { mastodonOAuthService } from '#services/oauth/mastodon_oauth_service'
import { oauthStateService } from '#services/oauth/oauth_state_service'
import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class CallbackController {
  async handle({ request, response }: HttpContext) {
    
    const { code, state: encodedState, error } = request.qs()

    // Provider denied access
    if (error) {
      return this.redirectWithError(response, 'access_denied')
    }

    if (!code || !encodedState) {
      return this.redirectWithError(response, 'invalid_request')
    }

    const state = oauthStateService.decode(encodedState)
    if (!state) {
      return this.redirectWithError(response, 'invalid_state')
    }

    let tokens
    let profile
    try {
      tokens = await mastodonOAuthService.exchangeCode(code)
      profile = await mastodonOAuthService.getProfile(tokens.accessToken)
    } catch {
      return this.redirectWithError(response, 'token_exchange_failed', state.redirectTo)
    }
    
    await SocialAccount.updateOrCreate(
      { userId: state.userId, platformId: state.platformId },
      {
        providerUserId: profile.providerUserId,
        username: profile.username,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt ? DateTime.fromISO(tokens.expiresAt) : null,
        scope: tokens.scope,
      }
    )

    const redirectTo = state.redirectTo ?? env.get('APP_URL')
    return response.redirect(`${redirectTo}?oauth=success&platform=mastodon`)
  }

  private redirectWithError(response: any, reason: string, redirectTo?: string) {
    const base = redirectTo ?? env.get('APP_URL')
    return response.redirect(`${base}?oauth=error&reason=${reason}`)
  }
}
