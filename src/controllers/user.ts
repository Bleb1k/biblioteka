import {
  Body,
  Controller,
  Ctx,
  Delete,
  Get,
  Params,
  Post,
  Put,
  Query,
} from 'amala'
import { Context } from 'koa'
import { User, UserModel, findOrCreateUser, findUsers } from '@/models/User'
import { forbidden, notFound } from '@hapi/boom'
import UserBody from '@/validators/UserBody'

/**
 *@Controller('/user')
 *  @Get('/new')
 *    body = {
 *      firstName: string
 *      lastName: string
 *      patronymic?: string
 *      class?: string
 *    }
 *  @Get('/')
 *    @Query('firstName') firstName?: string,
 *    @Query('lastName') lastName?: string,
 *    @Query('patronymic') patronymic?: string,
 *    @Query('class') klass?: string,
 *    @Query('page') page?: number
 */
@Controller('/user')
export default class UserController {
  @Post('/new')
  async newUser(@Body({ required: true }) body: UserBody) {
    let user = await findOrCreateUser(JSON.parse(body.toString()))
    return user.strippedAndFilled()
  }

  @Get('/search')
  async search(
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('patronymic') patronymic?: string,
    @Query('class') klass?: string,
    @Query('page') page?: number
  ) {
    let filter = Object()
    if (firstName) filter.firstName = firstName
    if (lastName) filter.lastName = lastName
    if (patronymic) filter.patronymic = patronymic
    if (klass) filter.class = klass
    const users = await findUsers(filter, Math.floor(page || 0))
    return users.map((user) => user.strippedAndFilled())
  }

  @Put('/:token')
  async update(
    @Body({ required: true }) body: UserBody,
    @Params('token') token: string
  ) {
    if (!token) throw forbidden('No token provided')
    let user = await findOrCreateUser({ token })
    if (!user) throw notFound('User not found')
    user.set(JSON.parse(body.toString()))
    return user.strippedAndFilled()
  }

  @Delete('/:token')
  async delete(@Params('token') token: string) {
    if (!token) throw forbidden('No token provided')
    let user = await UserModel.findOneAndDelete({ token })
    if (!user) throw notFound('User not found')
    return user
  }
}
