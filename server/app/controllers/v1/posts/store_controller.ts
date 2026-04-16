import Brand from '#models/brand'
import Post from '#models/post'
import SocialPlatform from '#models/social_platform'
import ForbiddenException from '#exceptions/forbidden_exception'
import { HttpContext } from '@adonisjs/core/http'
import { createPostValidator } from '#validators/post/create_validator'

export default class StoreController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await createPostValidator.validate(request.body())
    const brand = await Brand.query()
      .where('id', payload.brandId)
      .where('userId', user.id) 
      .first()

    if (!brand) {
      throw new ForbiddenException('Brand not found or does not belong to you')
    }

    const platform = await SocialPlatform.query()
      .where('id', payload.platformId)
      .where('brandId', brand.id)
      .first()

    if (!platform) {
      throw new ForbiddenException('Platform not found or does not belong to this brand')
    }
    
    const post = new Post();
    post.brandId = brand.id
    // post.platformId = platform.id
    // post.userId = user.id
    post.title = payload.title
    post.content = payload.content
    post.state = payload.state ?? 'draft'
    post.isAiGenerated = payload.isAiGenerated ?? false
    
    await post.save()

    return response.status(201).json({
      status: 'success',
      message: 'Post created successfully',
      data: post,
    })
  }
}
