import { HttpContext } from '@adonisjs/core/http';
import { updateProfileValidator } from '#validators/user/update_validator';

export default class UpdateProfileController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail();
    const { firstName, lastName } = await request.validateUsing(
      updateProfileValidator,
    );

    user.firstName = firstName;
    user.lastName = lastName;
    await user.save();

    return response.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    });
  }
}
