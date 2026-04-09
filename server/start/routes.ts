/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router.group(() => {
  //#region Auth
  router.group(() => {

    // Login
    router.post('/login', [controllers.v1.auth.Login])

    // Register
    router.post('/register', [controllers.v1.auth.Register])

    // Logout
    router.delete('/logout', [controllers.v1.auth.Logout]).use(
      middleware.auth({
        guards: ['api'],
      })
    )
  })
  .prefix('auth')
  //#endregion

  //#region Users
  router.group(() => {
    router.post('/me', [controllers.v1.users.Me])
  })
  .middleware(middleware.auth())
  .prefix('users')
  //#endregion

})
.prefix('api/v1')


// router
//   .group(() => {
//     router
//       .group(() => {
//         router.post('signup', [controllers.NewAccount, 'store'])
//         router.post('login', [controllers.AccessToken, 'store'])
//         router.post('logout', [controllers.AccessToken, 'destroy']).use(middleware.auth())
//       })
//       .prefix('auth')
//       .as('auth')

//     router
//       .group(() => {
//         router.get('/profile', [controllers.Profile, 'show'])
//       })
//       .prefix('account')
//       .as('profile')
//       .use(middleware.auth())
//   })
//   .prefix('/api/v1')
