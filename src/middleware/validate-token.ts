import { CookieOptions, NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { MODE, SECRET_KEY } from '../config'

const SECRET = SECRET_KEY as string

export default async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { access_token, refresh_token } = req.cookies

    if (!access_token) {
      res
        .status(401)
        .json({ message: 'Acceso denegado. Token no proporcionado' })
      return
    }

    try {
      jwt.verify(access_token, SECRET)
      next()
    } catch (error) {
      if (!refresh_token) {
        res
          .status(401)
          .json({ message: 'Sesión expirada. Inicia sesión nuevamente' })
        return
      }

      const decoded = jwt.verify(access_token, SECRET)
      const newAccessToken = jwt.sign({ id: (decoded as any).user }, SECRET, {
        expiresIn: '30m'
      })
      const newRefreshToken = jwt.sign({ id: (decoded as any).user }, SECRET, {
        expiresIn: '1d'
      })

      const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: MODE === 'production',
        maxAge: 30 * 60 * 1000,
        sameSite: 'strict'
      }

      res
        .cookie('access_token', newAccessToken, cookieOptions)
        .cookie('refresh_token', newRefreshToken, {
          ...cookieOptions,
          maxAge: 24 * 60 * 60 * 1000
        })
      next()
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
