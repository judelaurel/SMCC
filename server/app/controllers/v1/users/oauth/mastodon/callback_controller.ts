import SocialAccount from '#models/social_account';
import { mastodonOAuthService } from '#services/oauth/mastodon_oauth_service';
import { oauthStateService } from '#services/oauth/oauth_state_service';
import { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';

export default class CallbackController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail();

    const { code, state: encodedState } = request.body();

    if (!code || !encodedState) {
      return response.status(400).json({
        status: 'error',
        message: 'Missing code or state',
      });
    }

    const state = oauthStateService.decode(encodedState);
    if (!state) {
      return response.status(400).json({
        status: 'error',
        message: 'Invalid or expired state',
      });
    }

    if (state.userId !== user.id) {
      return response.status(403).json({
        status: 'error',
        message: 'State user mismatch',
      });
    }

    let tokens;
    let profile;
    try {
      tokens = await mastodonOAuthService.exchangeCode(code);
      profile = await mastodonOAuthService.getProfile(tokens.accessToken);
    } catch (err: any) {
      return response.status(502).json({
        status: 'error',
        message: err?.message ?? 'Token exchange failed',
      });
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
      },
    );

    return response.status(200).json({
      status: 'success',
      message: 'Mastodon account connected successfully',
      data: { platform: 'mastodon', username: profile.username },
    });
  }
}
