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

  //#region Brands
  router.group(() => {
    router.get('/', [controllers.v1.brands.Index])
    router.post('/', [controllers.v1.brands.Store])
    router.get('/:id', [controllers.v1.brands.Show])
    router.put('/:id', [controllers.v1.brands.Update])
    router.delete('/:id', [controllers.v1.brands.Destroy])

    // Platforms sub-resource
    router.get('/:brandId/platforms', [controllers.v1.brands.platforms.Index])
    router.post('/:brandId/platforms', [controllers.v1.brands.platforms.Store])
    router.delete('/:brandId/platforms/:platformId', [controllers.v1.brands.platforms.Destroy])
  })
  .middleware(middleware.auth())
  .prefix('brands')
  //#endregion

  //#region Posts
  router.group(() => {
    router.post('/generate-ai', [controllers.v1.posts.GenerateAi])
    router.get('/', [controllers.v1.posts.Index])
    router.post('/', [controllers.v1.posts.Store])
    router.get('/:id', [controllers.v1.posts.Show])
    router.put('/:id', [controllers.v1.posts.Update])
    router.delete('/:id', [controllers.v1.posts.Destroy])
  })
  .middleware(middleware.auth())
  .prefix('posts')
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
