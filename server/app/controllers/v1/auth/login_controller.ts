
import InternalServerException from '#exceptions/internal_server_exception'
import User from '#models/user'
import NotFoundException from '#exceptions/not_found_exception'
import { loginValidator } from '#validators/auth/login_validator'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { errors as authErrors } from '@adonisjs/auth'
import UnauthorizedException from '#exceptions/unauthorized_exception'


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
                message: 'User logged in successfully', // The message of the response
                data: {
                    metadata: token,
                },
            })

        }
        catch (error) {
            logger.error(error)
            if(error instanceof authErrors.E_INVALID_CREDENTIALS) {
                throw new UnauthorizedException('Invalid credentials')
            }

            if(error instanceof NotFoundException) {
                throw error
            }
            throw new InternalServerException('Internal Server Error')
        }
    }
}