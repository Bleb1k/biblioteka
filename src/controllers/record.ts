import { Body, Controller, Ctx, Get, Params, Post, Put, Query } from 'amala'
import { Context } from 'koa'
import { Book, BookModel, findBooks, findOrCreateBook } from '@/models/Book'
import { badRequest, notFound } from '@hapi/boom'
import {
  Record,
  RecordModel,
  findOrCreateRecord,
  findRecords,
} from '@/models/Record'
import RecordInfo from '@/validators/RecordInfo'

/*
@Controller('/record')
  @Post('/new')
    body = {
      user!: string
      book!: string
      // (new Date("yyyy-mm-dd")).toISOString()
      @IsISO8601({ strict: true })
      returnDate!: string
    }
  @Get('/search')
    @Query('user') user?: string,
    @Query('book') book?: string,
    @Query('returnDate') returnDate?: string,
    @Query('retrievalDate') retrievalDate?: string,
    @Query('page') page?: number
  @Put('/:id')

 */
@Controller('/record')
export default class RecordController {
  @Post('/new')
  async newBook(@Body({ required: true }) body: RecordInfo) {
    const record = await findOrCreateRecord(body)
    return record.strippedAndFilled()
  }

  @Get('/search')
  async search(
    @Query('user') user?: string,
    @Query('book') book?: string,
    @Query('returnDate') returnDate?: string,
    @Query('retrievalDate') retrievalDate?: string,
    @Query('page') page?: number
  ) {
    let filter = Object()
    if (user) filter.user = user
    if (book) filter.book = book
    if (returnDate) filter.returnDate = returnDate
    if (retrievalDate) filter.retrievalDate = retrievalDate
    const books = await findRecords(filter, Math.floor(page || 0))
    return books.map((book) => book.strippedAndFilled())
  }

  @Put('/retrieve')
  async update(@Query('id') id?: string) {
    if (!id) throw badRequest('No id provided')
    const record = await RecordModel.findById(id)
    if (!record) throw notFound('Record not found')
    record.retrievalDate = new Date().toISOString()
    return (await record.save()).strippedAndFilled()
  }
}
