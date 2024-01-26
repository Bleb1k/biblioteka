import { Body, Controller, Ctx, Post } from 'amala'
import { Context } from 'koa'
import { findOrCreateBook } from '@/models/Book'
import { forbidden } from '@hapi/boom'
import { verifyTelegramPayload } from '@/helpers/verifyTelegramPayload'
import FacebookLogin from '@/validators/FacebookLogin'
import BookInfo from '@/validators/BookInfo'
import GoogleLogin from '@/validators/GoogleLogin'
import TelegramLogin from '@/validators/TelegramLogin'
import getFBUser from '@/helpers/getFBUser'
import getGoogleUser from '@/helpers/getGoogleUser'

@Controller('/bookshelf')
export default class BookshelfController {
  @Post('/')
  async newBook(@Body({ required: true }) body: BookInfo) {
    const user = await findOrCreateBook(body)
    return user.strippedAndFilled()
  }
}
