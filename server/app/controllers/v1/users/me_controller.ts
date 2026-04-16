import ForbiddenException from "#exceptions/forbidden_exception";
import { HttpContext } from "@adonisjs/core/http";


export default class MeController {

    async handle({ auth, response}: HttpContext) {
        
        try {
            const authUser = await auth.getUserOrFail(); 
            if (!authUser || authUser.isDeleted) {
                if (!authUser) {
                    throw new ForbiddenException('User not found')
                }
            }   

            const userFormat = {
                id: authUser.id,
                username: authUser.username,
                firstName: authUser.firstName,
                lastName: authUser.lastName,
                email: authUser.email,
                createdAt: authUser.createdAt,
                updatedAt: authUser.updatedAt,
            }

            response.status(200).json({
                status: 'success',
                message: 'User retrieved successfully',
                data: {
                    user: userFormat,
                },
            })

        }catch (error) {
            throw error
        }   
    }
}