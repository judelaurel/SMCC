/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'login': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['login']['types'],
  },
  'register': {
    methods: ["POST"],
    pattern: '/api/v1/auth/register',
    tokens: [{"old":"/api/v1/auth/register","type":0,"val":"api","end":""},{"old":"/api/v1/auth/register","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/register","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['register']['types'],
  },
  'logout': {
    methods: ["DELETE"],
    pattern: '/api/v1/auth/logout',
    tokens: [{"old":"/api/v1/auth/logout","type":0,"val":"api","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['logout']['types'],
  },
  'me': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users/me',
    tokens: [{"old":"/api/v1/users/me","type":0,"val":"api","end":""},{"old":"/api/v1/users/me","type":0,"val":"v1","end":""},{"old":"/api/v1/users/me","type":0,"val":"users","end":""},{"old":"/api/v1/users/me","type":0,"val":"me","end":""}],
    types: placeholder as Registry['me']['types'],
  },
  'users.profile.update': {
    methods: ["PUT"],
    pattern: '/api/v1/users/profile',
    tokens: [{"old":"/api/v1/users/profile","type":0,"val":"api","end":""},{"old":"/api/v1/users/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/users/profile","type":0,"val":"users","end":""},{"old":"/api/v1/users/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['users.profile.update']['types'],
  },
  'users.password.update': {
    methods: ["PUT"],
    pattern: '/api/v1/users/password',
    tokens: [{"old":"/api/v1/users/password","type":0,"val":"api","end":""},{"old":"/api/v1/users/password","type":0,"val":"v1","end":""},{"old":"/api/v1/users/password","type":0,"val":"users","end":""},{"old":"/api/v1/users/password","type":0,"val":"password","end":""}],
    types: placeholder as Registry['users.password.update']['types'],
  },
  'permission': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users/permissions',
    tokens: [{"old":"/api/v1/users/permissions","type":0,"val":"api","end":""},{"old":"/api/v1/users/permissions","type":0,"val":"v1","end":""},{"old":"/api/v1/users/permissions","type":0,"val":"users","end":""},{"old":"/api/v1/users/permissions","type":0,"val":"permissions","end":""}],
    types: placeholder as Registry['permission']['types'],
  },
  'oauth.mastodon.redirect': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users/oauth/mastodon/redirect',
    tokens: [{"old":"/api/v1/users/oauth/mastodon/redirect","type":0,"val":"api","end":""},{"old":"/api/v1/users/oauth/mastodon/redirect","type":0,"val":"v1","end":""},{"old":"/api/v1/users/oauth/mastodon/redirect","type":0,"val":"users","end":""},{"old":"/api/v1/users/oauth/mastodon/redirect","type":0,"val":"oauth","end":""},{"old":"/api/v1/users/oauth/mastodon/redirect","type":0,"val":"mastodon","end":""},{"old":"/api/v1/users/oauth/mastodon/redirect","type":0,"val":"redirect","end":""}],
    types: placeholder as Registry['oauth.mastodon.redirect']['types'],
  },
  'oauth.mastodon.callback': {
    methods: ["POST"],
    pattern: '/api/v1/users/oauth/mastodon/callback',
    tokens: [{"old":"/api/v1/users/oauth/mastodon/callback","type":0,"val":"api","end":""},{"old":"/api/v1/users/oauth/mastodon/callback","type":0,"val":"v1","end":""},{"old":"/api/v1/users/oauth/mastodon/callback","type":0,"val":"users","end":""},{"old":"/api/v1/users/oauth/mastodon/callback","type":0,"val":"oauth","end":""},{"old":"/api/v1/users/oauth/mastodon/callback","type":0,"val":"mastodon","end":""},{"old":"/api/v1/users/oauth/mastodon/callback","type":0,"val":"callback","end":""}],
    types: placeholder as Registry['oauth.mastodon.callback']['types'],
  },
  'index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/brands',
    tokens: [{"old":"/api/v1/brands","type":0,"val":"api","end":""},{"old":"/api/v1/brands","type":0,"val":"v1","end":""},{"old":"/api/v1/brands","type":0,"val":"brands","end":""}],
    types: placeholder as Registry['index']['types'],
  },
  'brands.store': {
    methods: ["POST"],
    pattern: '/api/v1/brands',
    tokens: [{"old":"/api/v1/brands","type":0,"val":"api","end":""},{"old":"/api/v1/brands","type":0,"val":"v1","end":""},{"old":"/api/v1/brands","type":0,"val":"brands","end":""}],
    types: placeholder as Registry['brands.store']['types'],
  },
  'brands.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/brands/:id',
    tokens: [{"old":"/api/v1/brands/:id","type":0,"val":"api","end":""},{"old":"/api/v1/brands/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/brands/:id","type":0,"val":"brands","end":""},{"old":"/api/v1/brands/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['brands.show']['types'],
  },
  'brands.update': {
    methods: ["PUT"],
    pattern: '/api/v1/brands/:id',
    tokens: [{"old":"/api/v1/brands/:id","type":0,"val":"api","end":""},{"old":"/api/v1/brands/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/brands/:id","type":0,"val":"brands","end":""},{"old":"/api/v1/brands/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['brands.update']['types'],
  },
  'brands.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/brands/:id',
    tokens: [{"old":"/api/v1/brands/:id","type":0,"val":"api","end":""},{"old":"/api/v1/brands/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/brands/:id","type":0,"val":"brands","end":""},{"old":"/api/v1/brands/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['brands.destroy']['types'],
  },
  'brand-members.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/brands/:brandId/members',
    tokens: [{"old":"/api/v1/brands/:brandId/members","type":0,"val":"api","end":""},{"old":"/api/v1/brands/:brandId/members","type":0,"val":"v1","end":""},{"old":"/api/v1/brands/:brandId/members","type":0,"val":"brands","end":""},{"old":"/api/v1/brands/:brandId/members","type":1,"val":"brandId","end":""},{"old":"/api/v1/brands/:brandId/members","type":0,"val":"members","end":""}],
    types: placeholder as Registry['brand-members.index']['types'],
  },
  'brand-members.store': {
    methods: ["POST"],
    pattern: '/api/v1/brands/:brandId/members',
    tokens: [{"old":"/api/v1/brands/:brandId/members","type":0,"val":"api","end":""},{"old":"/api/v1/brands/:brandId/members","type":0,"val":"v1","end":""},{"old":"/api/v1/brands/:brandId/members","type":0,"val":"brands","end":""},{"old":"/api/v1/brands/:brandId/members","type":1,"val":"brandId","end":""},{"old":"/api/v1/brands/:brandId/members","type":0,"val":"members","end":""}],
    types: placeholder as Registry['brand-members.store']['types'],
  },
  'brand-members.update': {
    methods: ["PUT"],
    pattern: '/api/v1/brands/:brandId/members/:memberId',
    tokens: [{"old":"/api/v1/brands/:brandId/members/:memberId","type":0,"val":"api","end":""},{"old":"/api/v1/brands/:brandId/members/:memberId","type":0,"val":"v1","end":""},{"old":"/api/v1/brands/:brandId/members/:memberId","type":0,"val":"brands","end":""},{"old":"/api/v1/brands/:brandId/members/:memberId","type":1,"val":"brandId","end":""},{"old":"/api/v1/brands/:brandId/members/:memberId","type":0,"val":"members","end":""},{"old":"/api/v1/brands/:brandId/members/:memberId","type":1,"val":"memberId","end":""}],
    types: placeholder as Registry['brand-members.update']['types'],
  },
  'brand-members.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/brands/:brandId/members/:memberId',
    tokens: [{"old":"/api/v1/brands/:brandId/members/:memberId","type":0,"val":"api","end":""},{"old":"/api/v1/brands/:brandId/members/:memberId","type":0,"val":"v1","end":""},{"old":"/api/v1/brands/:brandId/members/:memberId","type":0,"val":"brands","end":""},{"old":"/api/v1/brands/:brandId/members/:memberId","type":1,"val":"brandId","end":""},{"old":"/api/v1/brands/:brandId/members/:memberId","type":0,"val":"members","end":""},{"old":"/api/v1/brands/:brandId/members/:memberId","type":1,"val":"memberId","end":""}],
    types: placeholder as Registry['brand-members.destroy']['types'],
  },
  'brand-members.available-users': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/brands/:brandId/members/available-users',
    tokens: [{"old":"/api/v1/brands/:brandId/members/available-users","type":0,"val":"api","end":""},{"old":"/api/v1/brands/:brandId/members/available-users","type":0,"val":"v1","end":""},{"old":"/api/v1/brands/:brandId/members/available-users","type":0,"val":"brands","end":""},{"old":"/api/v1/brands/:brandId/members/available-users","type":1,"val":"brandId","end":""},{"old":"/api/v1/brands/:brandId/members/available-users","type":0,"val":"members","end":""},{"old":"/api/v1/brands/:brandId/members/available-users","type":0,"val":"available-users","end":""}],
    types: placeholder as Registry['brand-members.available-users']['types'],
  },
  'platforms.retrieve': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/brands/:brandId/platforms',
    tokens: [{"old":"/api/v1/brands/:brandId/platforms","type":0,"val":"api","end":""},{"old":"/api/v1/brands/:brandId/platforms","type":0,"val":"v1","end":""},{"old":"/api/v1/brands/:brandId/platforms","type":0,"val":"brands","end":""},{"old":"/api/v1/brands/:brandId/platforms","type":1,"val":"brandId","end":""},{"old":"/api/v1/brands/:brandId/platforms","type":0,"val":"platforms","end":""}],
    types: placeholder as Registry['platforms.retrieve']['types'],
  },
  'platforms.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/brands/:brandId/platforms/:platformId',
    tokens: [{"old":"/api/v1/brands/:brandId/platforms/:platformId","type":0,"val":"api","end":""},{"old":"/api/v1/brands/:brandId/platforms/:platformId","type":0,"val":"v1","end":""},{"old":"/api/v1/brands/:brandId/platforms/:platformId","type":0,"val":"brands","end":""},{"old":"/api/v1/brands/:brandId/platforms/:platformId","type":1,"val":"brandId","end":""},{"old":"/api/v1/brands/:brandId/platforms/:platformId","type":0,"val":"platforms","end":""},{"old":"/api/v1/brands/:brandId/platforms/:platformId","type":1,"val":"platformId","end":""}],
    types: placeholder as Registry['platforms.destroy']['types'],
  },
  'generate_ai': {
    methods: ["POST"],
    pattern: '/api/v1/posts/generate-ai',
    tokens: [{"old":"/api/v1/posts/generate-ai","type":0,"val":"api","end":""},{"old":"/api/v1/posts/generate-ai","type":0,"val":"v1","end":""},{"old":"/api/v1/posts/generate-ai","type":0,"val":"posts","end":""},{"old":"/api/v1/posts/generate-ai","type":0,"val":"generate-ai","end":""}],
    types: placeholder as Registry['generate_ai']['types'],
  },
  'posts.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/posts',
    tokens: [{"old":"/api/v1/posts","type":0,"val":"api","end":""},{"old":"/api/v1/posts","type":0,"val":"v1","end":""},{"old":"/api/v1/posts","type":0,"val":"posts","end":""}],
    types: placeholder as Registry['posts.index']['types'],
  },
  'posts.store': {
    methods: ["POST"],
    pattern: '/api/v1/posts',
    tokens: [{"old":"/api/v1/posts","type":0,"val":"api","end":""},{"old":"/api/v1/posts","type":0,"val":"v1","end":""},{"old":"/api/v1/posts","type":0,"val":"posts","end":""}],
    types: placeholder as Registry['posts.store']['types'],
  },
  'posts.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/posts/:id',
    tokens: [{"old":"/api/v1/posts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/posts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/posts/:id","type":0,"val":"posts","end":""},{"old":"/api/v1/posts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['posts.show']['types'],
  },
  'posts.update': {
    methods: ["PUT"],
    pattern: '/api/v1/posts/:id',
    tokens: [{"old":"/api/v1/posts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/posts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/posts/:id","type":0,"val":"posts","end":""},{"old":"/api/v1/posts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['posts.update']['types'],
  },
  'posts.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/posts/:id',
    tokens: [{"old":"/api/v1/posts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/posts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/posts/:id","type":0,"val":"posts","end":""},{"old":"/api/v1/posts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['posts.destroy']['types'],
  },
  'social-platforms.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/social-platforms',
    tokens: [{"old":"/api/v1/social-platforms","type":0,"val":"api","end":""},{"old":"/api/v1/social-platforms","type":0,"val":"v1","end":""},{"old":"/api/v1/social-platforms","type":0,"val":"social-platforms","end":""}],
    types: placeholder as Registry['social-platforms.index']['types'],
  },
  'social-accounts.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/social-accounts',
    tokens: [{"old":"/api/v1/social-accounts","type":0,"val":"api","end":""},{"old":"/api/v1/social-accounts","type":0,"val":"v1","end":""},{"old":"/api/v1/social-accounts","type":0,"val":"social-accounts","end":""}],
    types: placeholder as Registry['social-accounts.index']['types'],
  },
  'social-accounts.store': {
    methods: ["POST"],
    pattern: '/api/v1/social-accounts',
    tokens: [{"old":"/api/v1/social-accounts","type":0,"val":"api","end":""},{"old":"/api/v1/social-accounts","type":0,"val":"v1","end":""},{"old":"/api/v1/social-accounts","type":0,"val":"social-accounts","end":""}],
    types: placeholder as Registry['social-accounts.store']['types'],
  },
  'social-accounts.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/social-accounts/:id',
    tokens: [{"old":"/api/v1/social-accounts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/social-accounts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/social-accounts/:id","type":0,"val":"social-accounts","end":""},{"old":"/api/v1/social-accounts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['social-accounts.show']['types'],
  },
  'social-accounts.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/social-accounts/:id',
    tokens: [{"old":"/api/v1/social-accounts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/social-accounts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/social-accounts/:id","type":0,"val":"social-accounts","end":""},{"old":"/api/v1/social-accounts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['social-accounts.destroy']['types'],
  },
  'scheduled-posts.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/scheduled-posts',
    tokens: [{"old":"/api/v1/scheduled-posts","type":0,"val":"api","end":""},{"old":"/api/v1/scheduled-posts","type":0,"val":"v1","end":""},{"old":"/api/v1/scheduled-posts","type":0,"val":"scheduled-posts","end":""}],
    types: placeholder as Registry['scheduled-posts.index']['types'],
  },
  'scheduled-posts.store': {
    methods: ["POST"],
    pattern: '/api/v1/scheduled-posts',
    tokens: [{"old":"/api/v1/scheduled-posts","type":0,"val":"api","end":""},{"old":"/api/v1/scheduled-posts","type":0,"val":"v1","end":""},{"old":"/api/v1/scheduled-posts","type":0,"val":"scheduled-posts","end":""}],
    types: placeholder as Registry['scheduled-posts.store']['types'],
  },
  'scheduled-posts.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/scheduled-posts/:id',
    tokens: [{"old":"/api/v1/scheduled-posts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/scheduled-posts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/scheduled-posts/:id","type":0,"val":"scheduled-posts","end":""},{"old":"/api/v1/scheduled-posts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['scheduled-posts.show']['types'],
  },
  'scheduled-posts.update': {
    methods: ["PUT"],
    pattern: '/api/v1/scheduled-posts/:id',
    tokens: [{"old":"/api/v1/scheduled-posts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/scheduled-posts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/scheduled-posts/:id","type":0,"val":"scheduled-posts","end":""},{"old":"/api/v1/scheduled-posts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['scheduled-posts.update']['types'],
  },
  'scheduled-posts.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/scheduled-posts/:id',
    tokens: [{"old":"/api/v1/scheduled-posts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/scheduled-posts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/scheduled-posts/:id","type":0,"val":"scheduled-posts","end":""},{"old":"/api/v1/scheduled-posts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['scheduled-posts.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
