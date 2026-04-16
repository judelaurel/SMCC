import ScheduledPost from '#models/scheduled_post'
import SocialAccount from '#models/social_account'
import { createScheduledPostValidator } from '#validators/scheduled_post/create_update_validator'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import PublishPost from '../../../jobs/publish_post.ts'
import logger from '@adonisjs/core/services/logger'

export default class StoreController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await createScheduledPostValidator.validate(request.body())

    // return payload;
    await SocialAccount.query()
      .where('id', payload.socialAccountId)
      .where('userId', user.id)
      .firstOrFail()

    const post = await ScheduledPost.create({
      socialAccountId: payload.socialAccountId,
      postId: payload.postId,
      postType: payload.postType ?? 'text',
      scheduledAt: payload.scheduledAt ? DateTime.fromISO(payload.scheduledAt) : DateTime.now().plus({ minutes: 5 }),
      publishStatus: 'pending',
    })

    if(post){
        const delay = Math.max(new Date(post.scheduledAt.toJSDate()).getTime() - Date.now())  
        await PublishPost.dispatch({ postId: post.postId, scheduledPostId: post.id }).in('1m')
        logger.info(`Scheduled PublishPost job for post ${post.postId} with scheduledPostId ${post.id} to run in ${delay} ms`)
    }

    return response.status(201).json({
      status: 'success',
      message: 'Post scheduled successfully',
      data: post,
    })
  }
}
