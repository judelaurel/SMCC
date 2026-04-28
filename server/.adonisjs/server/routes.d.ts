import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'login': { paramsTuple?: []; params?: {} }
    'register': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
    'me': { paramsTuple?: []; params?: {} }
    'users.profile.update': { paramsTuple?: []; params?: {} }
    'users.password.update': { paramsTuple?: []; params?: {} }
    'permission': { paramsTuple?: []; params?: {} }
    'oauth.mastodon.redirect': { paramsTuple?: []; params?: {} }
    'oauth.mastodon.callback': { paramsTuple?: []; params?: {} }
    'index': { paramsTuple?: []; params?: {} }
    'brands.store': { paramsTuple?: []; params?: {} }
    'brands.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'brands.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'brands.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'brand-members.index': { paramsTuple: [ParamValue]; params: {'brandId': ParamValue} }
    'brand-members.store': { paramsTuple: [ParamValue]; params: {'brandId': ParamValue} }
    'brand-members.update': { paramsTuple: [ParamValue,ParamValue]; params: {'brandId': ParamValue,'memberId': ParamValue} }
    'brand-members.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'brandId': ParamValue,'memberId': ParamValue} }
    'brand-members.available-users': { paramsTuple: [ParamValue]; params: {'brandId': ParamValue} }
    'platforms.retrieve': { paramsTuple: [ParamValue]; params: {'brandId': ParamValue} }
    'platforms.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'brandId': ParamValue,'platformId': ParamValue} }
    'generate_ai': { paramsTuple?: []; params?: {} }
    'posts.index': { paramsTuple?: []; params?: {} }
    'posts.store': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'social-platforms.index': { paramsTuple?: []; params?: {} }
    'social-accounts.index': { paramsTuple?: []; params?: {} }
    'social-accounts.store': { paramsTuple?: []; params?: {} }
    'social-accounts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'social-accounts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scheduled-posts.index': { paramsTuple?: []; params?: {} }
    'scheduled-posts.store': { paramsTuple?: []; params?: {} }
    'scheduled-posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scheduled-posts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scheduled-posts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'me': { paramsTuple?: []; params?: {} }
    'permission': { paramsTuple?: []; params?: {} }
    'oauth.mastodon.redirect': { paramsTuple?: []; params?: {} }
    'index': { paramsTuple?: []; params?: {} }
    'brands.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'brand-members.index': { paramsTuple: [ParamValue]; params: {'brandId': ParamValue} }
    'brand-members.available-users': { paramsTuple: [ParamValue]; params: {'brandId': ParamValue} }
    'platforms.retrieve': { paramsTuple: [ParamValue]; params: {'brandId': ParamValue} }
    'posts.index': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'social-platforms.index': { paramsTuple?: []; params?: {} }
    'social-accounts.index': { paramsTuple?: []; params?: {} }
    'social-accounts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scheduled-posts.index': { paramsTuple?: []; params?: {} }
    'scheduled-posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'me': { paramsTuple?: []; params?: {} }
    'permission': { paramsTuple?: []; params?: {} }
    'oauth.mastodon.redirect': { paramsTuple?: []; params?: {} }
    'index': { paramsTuple?: []; params?: {} }
    'brands.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'brand-members.index': { paramsTuple: [ParamValue]; params: {'brandId': ParamValue} }
    'brand-members.available-users': { paramsTuple: [ParamValue]; params: {'brandId': ParamValue} }
    'platforms.retrieve': { paramsTuple: [ParamValue]; params: {'brandId': ParamValue} }
    'posts.index': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'social-platforms.index': { paramsTuple?: []; params?: {} }
    'social-accounts.index': { paramsTuple?: []; params?: {} }
    'social-accounts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scheduled-posts.index': { paramsTuple?: []; params?: {} }
    'scheduled-posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'login': { paramsTuple?: []; params?: {} }
    'register': { paramsTuple?: []; params?: {} }
    'oauth.mastodon.callback': { paramsTuple?: []; params?: {} }
    'brands.store': { paramsTuple?: []; params?: {} }
    'brand-members.store': { paramsTuple: [ParamValue]; params: {'brandId': ParamValue} }
    'generate_ai': { paramsTuple?: []; params?: {} }
    'posts.store': { paramsTuple?: []; params?: {} }
    'social-accounts.store': { paramsTuple?: []; params?: {} }
    'scheduled-posts.store': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'logout': { paramsTuple?: []; params?: {} }
    'brands.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'brand-members.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'brandId': ParamValue,'memberId': ParamValue} }
    'platforms.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'brandId': ParamValue,'platformId': ParamValue} }
    'posts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'social-accounts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scheduled-posts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'users.profile.update': { paramsTuple?: []; params?: {} }
    'users.password.update': { paramsTuple?: []; params?: {} }
    'brands.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'brand-members.update': { paramsTuple: [ParamValue,ParamValue]; params: {'brandId': ParamValue,'memberId': ParamValue} }
    'posts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scheduled-posts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}