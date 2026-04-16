import logger from '@adonisjs/core/services/logger'
import axios from 'axios'

export default class MastodonService {

  /**
   * Post a status (text post)
   */
  public async postStatus({
    content,
    accessToken,
    instanceUrl,
    visibility = 'public',
  }: {
    content: string
    accessToken: string
    instanceUrl: string
    visibility?: 'public' | 'unlisted' | 'private' | 'direct'
  }) {

    try {
      const response = await axios.post(
        `${instanceUrl}/api/v1/statuses`,
        {
          status: content,
          visibility,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      logger.info(`Mastodon post successful: ${response.data.id} - ${response.data.url}`)

      return {
        success: true,
        postId: response.data.id,
        url: response.data.url,
      }

    } catch (error: any) {
      logger.error(`Mastodon post failed: ${error.response?.data || error.message}`)

      return {
        success: false,
        error: error.response?.data || error.message,
      }
    }
  }
}