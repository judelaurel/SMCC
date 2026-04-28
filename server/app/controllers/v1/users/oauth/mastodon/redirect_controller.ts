import SocialPlatform from '#models/social_platform';
import { mastodonOAuthService } from '#services/oauth/mastodon_oauth_service';
import { oauthStateService } from '#services/oauth/oauth_state_service';
import { HttpContext } from '@adonisjs/core/http';

export default class RedirectController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail();

    const platformId = Number(request.qs().platformId);
    if (!platformId) {
      return response.status(400).json({
        status: 'error',
        message: 'platformId query parameter is required',
      });
    }

    // check if user already has an inactive social account for this platform
    const existingAccount = await user
      .related('socialAccounts')
      .query()
      .where('platformId', platformId)
      .where('isActive', false)
      .first();

    if (existingAccount) {
      existingAccount.isActive = true;
      await existingAccount.save();

      return response.status(200).json({
        status: 'success',
        message: 'Social account reactivated successfully',
        data: { url: 'http://localhost:3000/settings?tab=social-accounts' },
      });
    }

    // Verify the platform belongs to a brand owned by the user and is mastodon
    const platform = await SocialPlatform.findByOrFail('id', platformId);

    const state = oauthStateService.encode({
      userId: user.id,
      platformId: platform.id,
      nonce: oauthStateService.nonce(),
      redirectTo: request.qs().redirectTo,
    });

    const authUrl = mastodonOAuthService.getAuthorizationUrl(state);

    return response.status(200).json({
      status: 'success',
      message: 'Redirect to Mastodon authorization',
      data: { url: authUrl },
    });
  }
}
