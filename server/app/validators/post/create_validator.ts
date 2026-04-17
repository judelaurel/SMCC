import vine from '@vinejs/vine';

const postState = vine.enum(['draft', 'completed', 'archived'] as const);

export const createPostValidator = vine.create({
  brandId: vine.number().positive(),
  title: vine.string().trim().minLength(1).maxLength(255),
  content: vine.string().trim().minLength(1),
  state: postState.optional(),
  isAiGenerated: vine.boolean().optional(),
});
