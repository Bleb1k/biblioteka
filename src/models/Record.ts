import {
  DocumentType,
  Ref,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose'
import { omit } from 'lodash'
import { User } from '@/models/User'
import { Book } from '@/models/Book'
import RecordInfo from '@/validators/RecordInfo'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Record {
  @prop({ index: true, required: true, ref: () => User })
  user!: Ref<User>
  @prop({ index: true, required: true, ref: () => Book })
  book!: Ref<Book>
  @prop({ index: true, required: true })
  returnDate!: string
  @prop({ index: true })
  retrievalDate?: string

  strippedAndFilled(this: DocumentType<Record>) {
    const stripFields = ['createdAt', 'updatedAt', '__v']
    return omit(this.toObject(), stripFields)
  }
}

export const RecordModel = getModelForClass(Record)

export async function findRecords(
  filter: Map<string, unknown>,
  page: number = 0
) {
  const limit = 10
  const skip = page * limit
  const records = await RecordModel.find(filter).skip(skip).limit(limit)
  if (!records) throw new Error('No records found')
  return records
}

export async function findOrCreateRecord(recordInfo: RecordInfo) {
  const record = await RecordModel.findOneAndUpdate(
    recordInfo,
    {},
    {
      new: true,
      upsert: true,
    }
  )
  if (!record) {
    throw new Error('Record not found')
  }
  return record
}
