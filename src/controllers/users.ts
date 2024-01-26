import { Body, Controller, Ctx, Get, Post } from 'amala'
import { Context } from 'koa'
import { User, UserModel, findOrCreateUser } from '@/models/User'
import { forbidden } from '@hapi/boom'

@Controller('/users')
export default class LoginController {
  @Post('/')
  async newUser(@Body({ required: true }) body: User) {
    let user = await findOrCreateUser(body)
    return user.strippedAndFilled()
  }
  @Get('/')
  async getUsers() {
    let users = await UserModel.find()
    return users.map((user) => user.strippedAndFilled())
  }
}
