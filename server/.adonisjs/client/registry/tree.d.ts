/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  login: typeof routes['login']
  register: typeof routes['register']
  logout: typeof routes['logout']
  me: typeof routes['me']
  permission: typeof routes['permission']
  oauth: {
    mastodon: {
      redirect: typeof routes['oauth.mastodon.redirect']
      callback: typeof routes['oauth.mastodon.callback']
    }
  }
  index: typeof routes['index']
  brands: {
    store: typeof routes['brands.store']
    show: typeof routes['brands.show']
    update: typeof routes['brands.update']
    destroy: typeof routes['brands.destroy']
  }
  platforms: {
    retrieve: typeof routes['platforms.retrieve']
    destroy: typeof routes['platforms.destroy']
  }
  generateAi: typeof routes['generate_ai']
  posts: {
    index: typeof routes['posts.index']
    store: typeof routes['posts.store']
    show: typeof routes['posts.show']
    update: typeof routes['posts.update']
    destroy: typeof routes['posts.destroy']
  }
  socialAccounts: {
    index: typeof routes['social-accounts.index']
    store: typeof routes['social-accounts.store']
    show: typeof routes['social-accounts.show']
    destroy: typeof routes['social-accounts.destroy']
  }
  scheduledPosts: {
    index: typeof routes['scheduled-posts.index']
    store: typeof routes['scheduled-posts.store']
    show: typeof routes['scheduled-posts.show']
    update: typeof routes['scheduled-posts.update']
    destroy: typeof routes['scheduled-posts.destroy']
  }
}
