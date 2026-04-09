
import InternalServerException from '#exceptions/internal_server_exception'
import User from '#models/user'
import NotFoundException from '#validators/auth/not_found_exception'
import { loginValidator } from '#validators/auth/register_validator copy'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { errors as authErrors } from '@adonisjs/auth'


export default class LoginController {

   async handle({ request, response }: HttpContext) {
        let user: User | null = null
        const payload = await loginValidator.validate(request.body())
        // const key = `login_attempts:${email}`
        // const lockKey = `login_lock:${email}`

        try{
            const { email, password, username } = payload
            const uid = email || username
            if (!uid) {
                return {
                    status: 'error',
                    message: 'Email or username is required',
                }
            }
            user = await User.verifyCredentials(uid, password)

            if (!user || user.isDeleted) {
                throw new NotFoundException('User not found')
            } 
            
            const token = await User.accessTokens.create(user)

             // Log user 
            logger.info(`user logged in successfully: ${user.email}`)

            // Return the user and profile
            return response.status(200).json({
                status: 'success', // The status of the response
                message: 'login successful', // The message of the response
                data: {
                    metadata: token,
                },
            })

        }
        catch (error) {
            logger.error(error)

            if(error instanceof NotFoundException || error instanceof authErrors.E_INVALID_CREDENTIALS) {
                throw error
            }
            throw new InternalServerException('Internal Server Error')
        }
    }
}