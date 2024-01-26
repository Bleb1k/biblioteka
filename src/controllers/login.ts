import { Body, Controller, Ctx, Post } from 'amala'
import { Context } from 'koa'
import { findOrCreateUser } from '@/models/User'
import { forbidden } from '@hapi/boom'
import { verifyTelegramPayload } from '@/helpers/verifyTelegramPayload'
import FacebookLogin from '@/validators/FacebookLogin'
import GoogleLogin from '@/validators/GoogleLogin'
import TelegramLogin from '@/validators/TelegramLogin'
import getFBUser from '@/helpers/getFBUser'
import getGoogleUser from '@/helpers/getGoogleUser'

@Controller('/login')
export default class LoginController {
  @Post('/')
  async newUser(@Body({ required: true }) body: User)
} 
