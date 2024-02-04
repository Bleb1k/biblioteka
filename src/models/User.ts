import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose'
import { omit } from 'lodash'
import { sign } from '@/helpers/jwt'
import { applyFilter } from '@/helpers/filter'
import { notFound } from '@hapi/boom'

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

  const users = await UserModel.find(applyFilter(filter))
    .skip(skip)
    .limit(limit)
  if (!users) throw new Error('No users found')
  return users
}

export async function findOrCreateUser({
  firstName,
  lastName,
  patronymic,
  class: klass,
  token,
}: {
  firstName?: string
  lastName?: string
  patronymic?: string
  class?: string
  token?: string
}) {
  // console.log('findOrCreateUser', {
  //   $or: [{ firstName, lastName, patronymic, class: klass }, { token }],
  // })
  let user = await UserModel.findOne({
    $or: [{ token }, { firstName, lastName, patronymic, class: klass }],
  })
  if (!user && !token && firstName && lastName) {
    user = await UserModel.findOneAndUpdate(
      Object.fromEntries(
        Object.entries({
          firstName,
          lastName,
          patronymic,
          class: klass,
        }).filter(([, v]) => v)
      ),
      {},
      {
        new: true,
        upsert: true,
      }
    )
  }
  if (!user) {
    throw notFound('User not found')
  }
  if (!user.token) {
    user.token = await sign({ id: user.id })
    await user.save()
  }
  return user
}
