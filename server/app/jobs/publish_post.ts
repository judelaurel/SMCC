import Post from '#models/post';
import ScheduledPost from '#models/scheduled_post';
import SocialAccount from '#models/social_account';
import MastodonService from '#services/platform/mastodon';
import env from '#start/env';
import logger from '@adonisjs/core/services/logger';
import { Job } from '@adonisjs/queue';
import type { JobOptions } from '@adonisjs/queue/types';
import { DateTime } from 'luxon';

interface PublishPostPayload {
  postId: number;
  scheduledPostId: number;
}

export default class PublishPost extends Job<PublishPostPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  };

  async execute() {
    const { postId, scheduledPostId } = this.payload;

    const post = await Post.findOrFail(postId);
    const scheduledPost = await ScheduledPost.findOrFail(scheduledPostId);
    const account = await SocialAccount.query()
      .where('id', scheduledPost.socialAccountId)
      .preload('platform')
      .firstOrFail();

    const result = await this.publishToPlatform(post, account);

    if (!result.success) {
      throw new Error(JSON.stringify(result.error));
    }

    // ✅ success
    post.state = 'completed';
    await post.save();

    scheduledPost.publishStatus = 'posted';
    scheduledPost.publishedAt = DateTime.now();
    await scheduledPost.save();

    logger.info(
      `Post ${postId} with scheduledPostId ${scheduledPostId} published successfully`,
    );
  }

  private async publishToPlatform(post: Post, account: SocialAccount) {
    const platformName = account.platform?.platform;

    switch (platformName) {
      case 'mastodon': {
        const mastodon = new MastodonService();
        const instanceUrl = `https://${env.get('MASTODON_INSTANCE') ?? 'mastodon.social'}`;
        return mastodon.postStatus({
          content: `${post.title}\n\n${post.content}`,
          accessToken: account.accessToken,
          instanceUrl,
        });
      }

      default:
        throw new Error(`Unsupported platform: ${platformName ?? 'unknown'}`);
    }
  }

  async failed(error: Error) {
    const { postId, scheduledPostId } = this.payload;

    const scheduledPost = await ScheduledPost.find(scheduledPostId);

    if (scheduledPost) {
      scheduledPost.publishStatus = 'failed';
      scheduledPost.errorMessage = error.message;
      scheduledPost.retryCount += 1;
      scheduledPost.lastAttemptAt = DateTime.now();

      await scheduledPost.save();
    }

    logger.error(
      `PublishPost failed for post ${postId} with scheduledPostId ${scheduledPostId}:`,
      error.message,
    );
  }
}
