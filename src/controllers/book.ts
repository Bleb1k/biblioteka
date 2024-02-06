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
import { Book, BookModel, findBooks, findOrCreateBook } from '@/models/Book'
import { forbidden, notFound } from '@hapi/boom'

/*
@Controller('/bookshelf')
  @Post('/')
    body = {
      name!: string
      author?: string
    }
  @Get('/')
    @Query('name') name?: string,
    @Query('author') author?: string,
    @Query('page') page?: number
 */
@Controller('/book')
export default class BookshelfController {
  @Post('/new')
  async newBook(@Body({ required: true }) body: Book) {
    const book = await findOrCreateBook(JSON.parse(body.toString()))
    return book.strippedAndFilled()
  }

  @Get('/search')
  async search(
    @Query('name') name?: string,
    @Query('author') author?: string,
    @Query('page') page?: number
  ) {
    let filter = Object()
    if (name) filter.name = name
    if (author) filter.author = author
    const books = await findBooks(filter, Math.floor(page || 0))
    return books.map((book) => book.strippedAndFilled())
  }

  @Put('/:token')
  async update(
    @Body({ required: true }) body: Book,
    @Params('token') token: string
  ) {
    if (!token) throw forbidden('No token provided')
    let book = await findOrCreateBook({ token })
    if (!book) throw notFound('Book not found')
    book.set(JSON.parse(body.toString()))
    return book.strippedAndFilled()
  }

  @Delete('/:token')
  async delete(@Params('token') token: string) {
    if (!token) throw forbidden('No token provided')
    let book = await BookModel.findOneAndDelete({ token })
    if (!book) throw notFound('Book not found')
    return book
  }
}
