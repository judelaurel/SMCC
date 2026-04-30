import vine from '@vinejs/vine';

export const createPostValidator = vine.create({
  brandId: vine.number().positive(),
  title: vine.string().trim().minLength(1).maxLength(255),
  content: vine.string().trim().minLength(1),
  isAiGenerated: vine.boolean().optional(),
});
