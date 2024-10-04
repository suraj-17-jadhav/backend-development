const {z} = require('zod')

const ChangePasswordRequestSchema = z.object({
    email: z.string().email('invalid email address'),
    old_password: z.string().min(1, 'please enter old password'),
    new_password: z.string().min(4, 'please enter new password with length more than 4.')
})

module.exports = ChangePasswordRequestSchema