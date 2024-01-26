import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose'
import { omit } from 'lodash'
import { sign } from '@/helpers/jwt'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class User {
  @prop({ index: true, required: true })
  firstName!: string
  @prop({ index: true, required: true })
  lastName!: string
  @prop({ index: true })
  patronymic?: string
  @prop({ index: true })
  class?: string

  @prop({ index: true, unique: true })
  token?: string

  strippedAndFilled(
    this: DocumentType<User>,
    { withToken = true }: { withToken?: boolean } = {}
  ) {
    const stripFields = ['createdAt', 'updatedAt', '__v']
    if (!withToken) {
      stripFields.push('token')
    }
    return omit(this.toObject(), stripFields)
  }
}

export const UserModel = getModelForClass(User)

export async function findUsers(
  filter: Map<string, unknown>,
  page: number = 0
) {
  const limit = 10
  const skip = page * limit
  const users = await UserModel.find(filter).skip(skip).limit(limit)
  if (!users) throw new Error('No users found')
  return users
}

export async function findOrCreateUser(loginOptions: {
  firstName: string
  lastName: string
  patronymic?: string
  class?: string
}) {
  const user = await UserModel.findOneAndUpdate(
    loginOptions,
    {},
    {
      new: true,
      upsert: true,
    }
  )
  if (!user) {
    throw new Error('User not found')
  }
  if (!user.token) {
    user.token = await sign({ id: user.id })
    await user.save()
  }
  return user
}
