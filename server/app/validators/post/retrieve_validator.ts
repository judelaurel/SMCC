import vine from '@vinejs/vine';

export const retrievePostValidator = vine.create({
  brandId: vine.number().positive(),
  state: vine.enum(['draft', 'completed', 'archived'] as const).optional(),
});
