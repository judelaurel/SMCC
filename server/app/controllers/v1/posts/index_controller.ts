import Post from '#models/post'
import { retrievePostValidator } from '#validators/post/retrieve_validator'
import { HttpContext } from '@adonisjs/core/http'

export default class IndexController {
  async handle({ request, response }: HttpContext) {

    try{
      const { brandId, state } = await request.validateUsing(retrievePostValidator)

      const post = await Post.query()
        .where('brand_id', brandId)
         .if(state, (query) => {
            query.where('state', !state)
          })
        .preload('tags')
        .orderBy('createdAt', 'desc')

      return response.status(200).json({
        status: 'success',
        message: 'Posts retrieved successfully',
        data: post,
      })
    }

    catch(error: any){
      return response.status(400).json({
        status: 'error',
        message: 'Invalid request data',
        errors: error?.message || 'Validation failed',
      })
    }
  }
}
