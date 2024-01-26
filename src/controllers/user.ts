import { Body, Controller, Ctx, Get, Post, Query } from 'amala'
import { Context } from 'koa'
import { User, UserModel, findOrCreateUser, findUsers } from '@/models/User'
import { forbidden } from '@hapi/boom'

/*
@Controller('/api/user')
  @Post('/')
    body = {
      firstName: string
      lastName: string
      patronymic?: string
      class?: string
    }
  @Get('/')
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('patronymic') patronymic?: string,
    @Query('class') klass?: string,
    @Query('page') page?: number
 */
@Controller('/user')
export default class UserController {
  @Post('/')
  async newUser(@Body({ required: true }) body: User) {
    let user = await findOrCreateUser(body)
    return user.strippedAndFilled()
  }

  @Get('/')
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
}
