import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'login': { paramsTuple?: []; params?: {} }
    'register': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
    'me': { paramsTuple?: []; params?: {} }
  }
  GET: {
  }
  HEAD: {
  }
  POST: {
    'login': { paramsTuple?: []; params?: {} }
    'register': { paramsTuple?: []; params?: {} }
    'me': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'logout': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}