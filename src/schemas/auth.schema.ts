import z from 'zod'

const User = z.object({
  email: z.string().email(),
  password: z.string()
})

export const Login = User