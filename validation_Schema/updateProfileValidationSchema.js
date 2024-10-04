const {z} = require('zod')

const UpdateProfileRequestSchema = z.object({
    name: z.string().min(1,'please enter  name'),
    email: z.string().email('invalid email address'),
    department: z.string().min(1, 'please enter department name'),
    mobile_number: z.string().min(10, "please enter valid mobile number"),
})

module.exports = UpdateProfileRequestSchema