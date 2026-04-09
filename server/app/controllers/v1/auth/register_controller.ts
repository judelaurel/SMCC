import InternalServerException from "#exceptions/internal_server_exception"
import User from "#models/user"
import { registerValidator } from "#validators/auth/register_validator"
import { HttpContext } from "@adonisjs/core/http"
import logger from "@adonisjs/core/services/logger"


export default class RegisterController {
    async handle({ request, response }: HttpContext) {
        
        // Validate the request body using the registerValidator
        const payload = await registerValidator.validate(request.body())

        try{
            const user = new User()

            user.firstName = payload.firstName
            user.lastName = payload.lastName
            user.username = payload.username
            user.email = payload.email
            user.password = payload.password

            await user.save()
            
            // Generate an access token for the user
            const token = await User.accessTokens.create(user)

            // Log user registration
            logger.info(`user registered successfully: ${user.email}`)

            // Return the user and profile
            return response.status(200).json({
                status: 'success', // The status of the response
                message: 'User registered successfully', // The message of the response
                data: {
                    metadata: token,
                },
            })
        }
        catch (error) {
            logger.error(error)
            throw new InternalServerException('Internal Server Error')
        }

    }
}
