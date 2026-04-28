import vine from '@vinejs/vine';

export const updateProfileValidator = vine.create({
  firstName: vine.string().trim().minLength(1).maxLength(100),
  lastName: vine.string().trim().minLength(1).maxLength(100),
});

export const updatePasswordValidator = vine.create({
  currentPassword: vine.string().minLength(8),
  newPassword: vine
    .string()
    .minLength(8)
    .maxLength(32)
    .regex(/^(?=.*[A-Z])(?=.*\d).{8,}$/),
  confirmNewPassword: vine.string().sameAs('newPassword'),
});
