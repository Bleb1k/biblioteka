import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose'
import { omit } from 'lodash'
import BookInfo from '@/validators/BookInfo'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Book {
  @prop({ index: true, required: true })
  name!: string
  @prop({ index: true })
  author?: string

  strippedAndFilled(this: DocumentType<Book>) {
    const stripFields = ['createdAt', 'updatedAt', '__v']
    return omit(this.toObject(), stripFields)
  }
}

export const BookModel = getModelForClass(Book)

export async function findOrCreateBook(bookInfo: {
  name: string
  author?: string
}) {
  const book = await BookModel.findOneAndUpdate(
    bookInfo,
    {},
    {
      new: true,
      upsert: true,
    }
  )
  if (!book) {
    throw new Error('Book not found')
  }
  return book
}
