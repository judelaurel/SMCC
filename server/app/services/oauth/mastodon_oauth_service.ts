import env from '#start/env';
import {
  BaseOAuthService,
  OAuthProfile,
  OAuthTokens,
} from './base_oauth_service.js';

export class MastodonOAuthService extends BaseOAuthService {
  readonly instance: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  readonly redirectUri: string;
  readonly scopes = 'read write';

  constructor() {
    super();
    this.instance = env.get('MASTODON_INSTANCE') ?? 'mastodon.social';
    this.clientId = env.get('MASTODON_CLIENT_ID') ?? '';
    this.clientSecret = env.get('MASTODON_CLIENT_SECRET')?.release() ?? '';
    this.redirectUri = `${env.get('FRONTEND_URL')}/oauth/callback/mastodon`;
  }

  private assertConfigured() {
    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        'Mastodon OAuth is not configured (MASTODON_CLIENT_ID / MASTODON_CLIENT_SECRET missing)',
      );
    }
  }

  getAuthorizationUrl(state: string): string {
    this.assertConfigured();
    const params = new URLSearchParams({
      client_id: this.clientId,
      scope: this.scopes,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      state,
    });
    console.log({
      instance: this.instance,
      redirectUri: this.redirectUri,
      clientId: this.clientId,
    });
    return `https://${this.instance}/oauth/authorize?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<OAuthTokens> {
    this.assertConfigured();
    const res = await fetch(`https://${this.instance}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code',
        code,
        scope: this.scopes,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Mastodon token exchange failed (${res.status}): ${text}`,
      );
    }

    const data = (await res.json()) as {
      access_token: string;
      token_type: string;
      scope: string;
      created_at?: number;
    };

    return {
      accessToken: data.access_token,
      refreshToken: null, // Mastodon auth_code flow does not issue refresh tokens
      expiresAt: null,
      scope: data.scope ?? null,
    };
  }

  async getProfile(accessToken: string): Promise<OAuthProfile> {
    const res = await fetch(
      `https://${this.instance}/api/v1/accounts/verify_credentials`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Mastodon profile fetch failed (${res.status})`);
    }

    const data = (await res.json()) as {
      id: string;
      username: string;
      acct: string;
    };

    return {
      providerUserId: data.id,
      // acct includes @domain for remote users; use it for full identity
      username: data.acct,
    };
  }
}

export const mastodonOAuthService = new MastodonOAuthService();
