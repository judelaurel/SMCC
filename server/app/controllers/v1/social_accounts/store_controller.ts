import SocialAccount from '#models/social_account';
import { createSocialAccountValidator } from '#validators/social_account/create_validator';
import { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';

export default class StoreController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail();
    const payload = await createSocialAccountValidator.validate(request.body());

    const existing = await SocialAccount.query()
      .where('userId', user.id)
      .where('platformId', payload.platformId)
      .first();

    if (existing) {
      await existing
        .merge({
          providerUserId: payload.providerUserId,
          username: payload.username,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken ?? null,
          expiresAt: payload.expiresAt
            ? DateTime.fromISO(payload.expiresAt)
            : null,
          scope: payload.scope ?? null,
          isActive: true,
        })
        .save();

      return response.status(200).json({
        status: 'success',
        message: 'Social account updated successfully',
        data: existing,
      });
    }

    const account = await SocialAccount.create({
      userId: user.id,
      platformId: payload.platformId,
      providerUserId: payload.providerUserId,
      username: payload.username,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken ?? null,
      expiresAt: payload.expiresAt ? DateTime.fromISO(payload.expiresAt) : null,
      scope: payload.scope ?? null,
    });

    return response.status(201).json({
      status: 'success',
      message: 'Social account linked successfully',
      data: account,
    });
  }
}
