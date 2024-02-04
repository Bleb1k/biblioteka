import { applyFilter } from '@/helpers/filter'
import { sign } from '@/helpers/jwt'
import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose'
import { omit } from 'lodash'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Book {
  @prop({ index: true, required: true })
  name!: string
  @prop({ index: true })
  author?: string

  @prop({ index: true, unique: true })
  token?: string

  strippedAndFilled(this: DocumentType<Book>) {
    const stripFields = ['createdAt', 'updatedAt', '__v']
    return omit(this.toObject(), stripFields)
  }
}

export const BookModel = getModelForClass(Book)

export async function findBooks(
  filter: Map<string, unknown>,
  page: number = 0
) {
  const limit = 10
  const skip = page * limit

  const books = await BookModel.find(applyFilter(filter))
    .skip(skip)
    .limit(limit)
  if (!books) throw new Error('No books found')
  return books
}

export async function findOrCreateBook({
  name,
  author,
  token,
}: {
  name: string
  author?: string
  token?: string
}) {
  const book = await BookModel.findOne(
    {
      $or: [{ token }, { author, name }],
    }
    // {},
    // {
    //   new: true,
    //   upsert: true,
    // }
  )
  if (!book) {
    throw new Error('Book not found')
  }
  if (!book.token) {
    book.token = await sign({ id: book.id })
    await book.save()
  }
  return book
}
