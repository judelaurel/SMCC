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

    router.get('/permissions', [controllers.v1.users.Permission])
    
    //#region OAuth
    router.group(() => {
      // Mastodon
      router
        .get('/mastodon/redirect', [controllers.v1.users.oauth.mastodon.Redirect])
        .as('oauth.mastodon.redirect')
        
      router
        .get('/mastodon/callback', [controllers.v1.users.oauth.mastodon.Callback])
        .as('oauth.mastodon.callback')
    })
    .prefix('oauth')
    //#endregion

  })
  .middleware(middleware.auth())
  .prefix('users')
  //#endregion

  //#region Brands
  router.group(() => {
    router.get('/', [controllers.v1.brands.Index])
    router.post('/', [controllers.v1.brands.Store]).as('brands.store')
    router.get('/:id', [controllers.v1.brands.Show]).as('brands.show')
    router.put('/:id', [controllers.v1.brands.Update]).as('brands.update')
    router.delete('/:id', [controllers.v1.brands.Destroy]).as('brands.destroy')

    // router.group(() => {
    //   router.get('/', [controllers.v1.brands.brandMembers.Index]).as('brand-members.index')
    //   router.post('/', [controllers.v1.brands.brandMembers.Store]).as('brand-members.store')
    //   router.get('/:memberId', [controllers.v1.brands.brandMembers.Show]).as('brand-members.show')
    //   router.delete('/:memberId', [controllers.v1.brands.brandMembers.Destroy]).as('brand-members.destroy')

    //   // Permissions
    //   router.get('/:memberId/permissions', [controllers.v1.brands.brandMembers.Permission]).as('brand-members.permissions')
    // })
    // .prefix('/:brandId/members')

    
    // Platforms sub-resource
    router.group(() => {
      router.get('/', [controllers.v1.platforms.Retrieve]).as('platforms.retrieve')
      // router.post('/', [controllers.v1.platforms.Create]).as('platforms.create')
      router.delete('/:platformId', [controllers.v1.platforms.Destroy]).as('platforms.destroy')
    })
    .prefix('/:brandId/platforms')  

  })
  .middleware(middleware.auth())
  .prefix('brands')
  // //#endregion

  //#region Posts
  router.group(() => {
    router.post('/generate-ai', [controllers.v1.posts.GenerateAi])
    router.get('/', [controllers.v1.posts.Index]).as('posts.index')
    router.post('/', [controllers.v1.posts.Store]).as('posts.store')
    router.get('/:id', [controllers.v1.posts.Show]).as('posts.show')
    router.put('/:id', [controllers.v1.posts.Update]).as('posts.update')
    router.delete('/:id', [controllers.v1.posts.Destroy]).as('posts.destroy')
  })
  .middleware(middleware.auth())
  .prefix('posts')
  //#endregion

  //#region Social Accounts
  router.group(() => {
    router.get('/', [controllers.v1.socialAccounts.Index]).as('social-accounts.index')
    router.post('/', [controllers.v1.socialAccounts.Store]).as('social-accounts.store')
    router.get('/:id', [controllers.v1.socialAccounts.Show]).as('social-accounts.show')
    router.delete('/:id', [controllers.v1.socialAccounts.Destroy]).as('social-accounts.destroy')
  })
  .middleware(middleware.auth())
  .prefix('social-accounts')
  //#endregion

  //#region Scheduled Posts
  router.group(() => {
    router.get('/', [controllers.v1.scheduledPosts.Index]).as('scheduled-posts.index')
    router.post('/', [controllers.v1.scheduledPosts.Store]).as('scheduled-posts.store')
    router.get('/:id', [controllers.v1.scheduledPosts.Show]).as('scheduled-posts.show')
    router.put('/:id', [controllers.v1.scheduledPosts.Update]).as('scheduled-posts.update')
    router.delete('/:id', [controllers.v1.scheduledPosts.Destroy]).as('scheduled-posts.destroy')
  })
  .middleware(middleware.auth())
  .prefix('scheduled-posts')
  //#endregion

})
.prefix('api/v1')

