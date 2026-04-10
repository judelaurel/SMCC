import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().maxLength(100).optional(),
    username: vine.string().trim().minLength(5).maxLength(50).optional(),
    password: vine.string().trim().minLength(8).maxLength(32),
  })
)
