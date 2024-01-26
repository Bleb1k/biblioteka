import { Body, Controller, Ctx, Get, Post, Query } from 'amala'
import { Context } from 'koa'
import { User, UserModel, findOrCreateUser } from '@/models/User'
import { forbidden } from '@hapi/boom'

/**
 * Users controller
 * @route /users\
 *       POST /users\
 * body={\
 * firstName: string,\
 * lastName: string,\
 * patronymic?: string,\
 * class?: string\
 * }\
 *       GET  /users\
 *
 */
@Controller('/users')
export default class LoginController {
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
    @Query('class') klass?: string
  ) {
    let filter = Object()
    if (firstName) filter.firstName = firstName
    if (lastName) filter.lastName = lastName
    if (patronymic) filter.patronymic = patronymic
    if (klass) filter.class = klass
    const users = await UserModel.find(filter)
    return users.map((user) => user.strippedAndFilled())
  }
}
