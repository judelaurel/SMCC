import vine from '@vinejs/vine';

const postState = vine.enum([
  'draft',
  'scheduled',
  'completed',
  'archived',
] as const);

export const updatePostValidator = vine.create({
  title: vine.string().trim().minLength(1).maxLength(255).optional(),
  content: vine.string().trim().minLength(1).optional(),
  state: postState.optional(),
  isAiGenerated: vine.boolean().optional(),
});
