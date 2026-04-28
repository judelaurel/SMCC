import vine from '@vinejs/vine';

export const createBrandMemberValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(),
    role: vine.enum(['admin', 'member'] as const),
  }),
);

export const updateBrandMemberValidator = vine.compile(
  vine.object({
    role: vine.enum(['admin', 'member'] as const),
  }),
);
