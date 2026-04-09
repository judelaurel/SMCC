import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  // Global messages applicable to all fields
  'required': 'The {{ field }} field is required',
  'string': 'The value of {{ field }} field must be a string',
  'email': 'The value is not a valid email address',
  maxLength: 'The {{ field }} must not exceed {{ max }} characters',
  minLength: 'The {{ field }} must be at least {{ min }} characters long',
  'unique': 'The {{ field }} must be unique',
})

export const registerValidator = vine.create({
  firstName: vine.string().trim(),
  lastName: vine.string().trim(),
  email: vine
      .string()
      .trim()
      .email()
      .maxLength(100)
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      })
      .toLowerCase(),
  username: vine.string().trim().minLength(5).maxLength(50)
    .unique(async (db, value) => {
        const user = await db.from('users').where('username', value).first()
        return !user
      })
      .toLowerCase(),
  password: vine.string()
      .trim()
      .minLength(8)
      .maxLength(32)
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z0-9]).{8,}$/)
      .confirmed({
        confirmationField: 'passwordConfirmation',
    }),
})