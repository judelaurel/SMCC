import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'login': { paramsTuple?: []; params?: {} }
    'register': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
    'me': { paramsTuple?: []; params?: {} }
    'permission': { paramsTuple?: []; params?: {} }
    'oauth.mastodon.redirect': { paramsTuple?: []; params?: {} }
    'oauth.mastodon.callback': { paramsTuple?: []; params?: {} }
    'index': { paramsTuple?: []; params?: {} }
    'brands.store': { paramsTuple?: []; params?: {} }
    'brands.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'brands.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'brands.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'platforms.retrieve': { paramsTuple: [ParamValue]; params: {'brandId': ParamValue} }
    'platforms.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'brandId': ParamValue,'platformId': ParamValue} }
    'generate_ai': { paramsTuple?: []; params?: {} }
    'posts.index': { paramsTuple?: []; params?: {} }
    'posts.store': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
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
    'permission': { paramsTuple?: []; params?: {} }
    'oauth.mastodon.redirect': { paramsTuple?: []; params?: {} }
    'oauth.mastodon.callback': { paramsTuple?: []; params?: {} }
    'index': { paramsTuple?: []; params?: {} }
    'brands.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'platforms.retrieve': { paramsTuple: [ParamValue]; params: {'brandId': ParamValue} }
    'posts.index': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'social-accounts.index': { paramsTuple?: []; params?: {} }
    'social-accounts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scheduled-posts.index': { paramsTuple?: []; params?: {} }
    'scheduled-posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'permission': { paramsTuple?: []; params?: {} }
    'oauth.mastodon.redirect': { paramsTuple?: []; params?: {} }
    'oauth.mastodon.callback': { paramsTuple?: []; params?: {} }
    'index': { paramsTuple?: []; params?: {} }
    'brands.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'platforms.retrieve': { paramsTuple: [ParamValue]; params: {'brandId': ParamValue} }
    'posts.index': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'social-accounts.index': { paramsTuple?: []; params?: {} }
    'social-accounts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scheduled-posts.index': { paramsTuple?: []; params?: {} }
    'scheduled-posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'login': { paramsTuple?: []; params?: {} }
    'register': { paramsTuple?: []; params?: {} }
    'me': { paramsTuple?: []; params?: {} }
    'brands.store': { paramsTuple?: []; params?: {} }
    'generate_ai': { paramsTuple?: []; params?: {} }
    'posts.store': { paramsTuple?: []; params?: {} }
    'social-accounts.store': { paramsTuple?: []; params?: {} }
    'scheduled-posts.store': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'logout': { paramsTuple?: []; params?: {} }
    'brands.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'platforms.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'brandId': ParamValue,'platformId': ParamValue} }
    'posts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'social-accounts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scheduled-posts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'brands.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'posts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'scheduled-posts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}