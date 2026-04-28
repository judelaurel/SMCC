import { HttpContext } from '@adonisjs/core/http';
import { updatePasswordValidator } from '#validators/user/update_validator';
import UnauthorizedException from '#exceptions/unauthorized_exception';
import hash from '@adonisjs/core/services/hash';

export default class UpdatePasswordController {
  async handle({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail();
    const { currentPassword, newPassword } = await request.validateUsing(
      updatePasswordValidator,
    );

    const isValid = await hash.verify(user.password, currentPassword);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return response.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
      data: null,
    });
  }
}
