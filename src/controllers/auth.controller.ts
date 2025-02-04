import { CookieOptions, Request, Response } from 'express'
import { PASSWD, SECRET_KEY, USER, MODE } from '../config'
import jwt from 'jsonwebtoken'

export function LoginController(req: Request, res: Response) {
  const { user, password } = req.body
  try {
    if (user === USER && password === PASSWD) {
      const accessToken = jwt.sign({ user }, SECRET_KEY as string, {
        expiresIn: '30m'
      })
      const refreshToken = jwt.sign({ user }, SECRET_KEY as string, {
        expiresIn: '1d'
      })

      const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: MODE === 'production', // Solo en HTTPS
        maxAge: 30 * 60 * 1000
      }

      res
        .cookie('access_token', accessToken, cookieOptions)
        .cookie('refresh_token', refreshToken, {
          ...cookieOptions,
          maxAge: 24 * 60 * 60 * 1000
        })
        .json({ message: 'Inicio de sesión exitosamente!', accessToken })

      return
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido algo' })
  }
}

export function LogoutController(req: Request, res: Response) {
  try {
    res
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .json({ message: 'Se ha cerrado la sesión' })
  } catch (error) {
    res.status(500).json({ message: 'Ha ocurrido algo' })
  }
}
