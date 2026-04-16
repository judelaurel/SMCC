import BrandMember from "#models/brand_member";
import { HttpContext } from "@adonisjs/core/http";


export default class PermissionController {

    async handle({ auth, response}: HttpContext) {
        const authUser = await auth.getUserOrFail();

        const brandMember = await BrandMember.query()
            .select('brandId', 'role')
            .where('userId', authUser.id)

            return response.status(200).json({
                status: 'success',
                message: 'Brand member permissions retrieved successfully',
                data: brandMember,
            })
    }   
}