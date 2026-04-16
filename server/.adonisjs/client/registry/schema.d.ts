/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'login': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth/login_validator').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth/login_validator').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/auth/login_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/auth/login_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'register': {
    methods: ["POST"]
    pattern: '/api/v1/auth/register'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth/register_validator').registerValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth/register_validator').registerValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/auth/register_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/auth/register_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'logout': {
    methods: ["DELETE"]
    pattern: '/api/v1/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/auth/logout_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/auth/logout_controller').default['handle']>>>
    }
  }
  'me': {
    methods: ["POST"]
    pattern: '/api/v1/users/me'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/users/me_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/users/me_controller').default['handle']>>>
    }
  }
  'permission': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/users/permissions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/users/permission_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/users/permission_controller').default['handle']>>>
    }
  }
  'oauth.mastodon.redirect': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/users/oauth/mastodon/redirect'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/users/oauth/mastodon/redirect_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/users/oauth/mastodon/redirect_controller').default['handle']>>>
    }
  }
  'oauth.mastodon.callback': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/users/oauth/mastodon/callback'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/users/oauth/mastodon/callback_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/users/oauth/mastodon/callback_controller').default['handle']>>>
    }
  }
  'index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/brands'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/brands/index_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/brands/index_controller').default['handle']>>>
    }
  }
  'brands.store': {
    methods: ["POST"]
    pattern: '/api/v1/brands'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/brand/create_validator').createBrandValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/brand/create_validator').createBrandValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/brands/store_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/brands/store_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'brands.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/brands/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/brands/show_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/brands/show_controller').default['handle']>>>
    }
  }
  'brands.update': {
    methods: ["PUT"]
    pattern: '/api/v1/brands/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/brand/update_validator').updateBrandValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/brand/update_validator').updateBrandValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/brands/update_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/brands/update_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'brands.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/brands/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/brands/destroy_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/brands/destroy_controller').default['handle']>>>
    }
  }
  'platforms.retrieve': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/brands/:brandId/platforms'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { brandId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/platforms/retrieve_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/platforms/retrieve_controller').default['handle']>>>
    }
  }
  'platforms.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/brands/:brandId/platforms/:platformId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { brandId: ParamValue; platformId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/platforms/destroy_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/platforms/destroy_controller').default['handle']>>>
    }
  }
  'generate_ai': {
    methods: ["POST"]
    pattern: '/api/v1/posts/generate-ai'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/ai_post').generateAiPostValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/ai_post').generateAiPostValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/posts/generate_ai_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/posts/generate_ai_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'posts.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/posts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/post/retrieve_validator').retrievePostValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/posts/index_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/posts/index_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'posts.store': {
    methods: ["POST"]
    pattern: '/api/v1/posts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/post/create_validator').createPostValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/post/create_validator').createPostValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/posts/store_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/posts/store_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'posts.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/posts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/posts/show_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/posts/show_controller').default['handle']>>>
    }
  }
  'posts.update': {
    methods: ["PUT"]
    pattern: '/api/v1/posts/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/post/update_validator').updatePostValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/post/update_validator').updatePostValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/posts/update_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/posts/update_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'posts.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/posts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/posts/destroy_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/posts/destroy_controller').default['handle']>>>
    }
  }
  'social-accounts.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/social-accounts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/social_accounts/index_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/social_accounts/index_controller').default['handle']>>>
    }
  }
  'social-accounts.store': {
    methods: ["POST"]
    pattern: '/api/v1/social-accounts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/social_account/create_validator').createSocialAccountValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/social_account/create_validator').createSocialAccountValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/social_accounts/store_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/social_accounts/store_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'social-accounts.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/social-accounts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/social_accounts/show_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/social_accounts/show_controller').default['handle']>>>
    }
  }
  'social-accounts.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/social-accounts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/social_accounts/destroy_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/social_accounts/destroy_controller').default['handle']>>>
    }
  }
  'scheduled-posts.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/scheduled-posts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/scheduled_posts/index_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/scheduled_posts/index_controller').default['handle']>>>
    }
  }
  'scheduled-posts.store': {
    methods: ["POST"]
    pattern: '/api/v1/scheduled-posts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/scheduled_post/create_update_validator').createScheduledPostValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/scheduled_post/create_update_validator').createScheduledPostValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/scheduled_posts/store_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/scheduled_posts/store_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'scheduled-posts.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/scheduled-posts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/scheduled_posts/show_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/scheduled_posts/show_controller').default['handle']>>>
    }
  }
  'scheduled-posts.update': {
    methods: ["PUT"]
    pattern: '/api/v1/scheduled-posts/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/scheduled_post/create_update_validator').updateScheduledPostValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/scheduled_post/create_update_validator').updateScheduledPostValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/scheduled_posts/update_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/scheduled_posts/update_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'scheduled-posts.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/scheduled-posts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v1/scheduled_posts/destroy_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v1/scheduled_posts/destroy_controller').default['handle']>>>
    }
  }
}
