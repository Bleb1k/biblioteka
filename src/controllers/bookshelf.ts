import { Body, Controller, Ctx, Get, Post, Query } from 'amala'
import { Context } from 'koa'
import { Book, BookModel, findOrCreateBook } from '@/models/Book'
import { forbidden } from '@hapi/boom'

@Controller('/bookshelf')
export default class BookshelfController {
  @Post('/')
  async newBook(@Body({ required: true }) body: Book) {
    const user = await findOrCreateBook(body)
    return user.strippedAndFilled()
  }

  @Get('/')
  async books() {
    const books = await BookModel.find()
    return books.map((book) => book.strippedAndFilled())
  }

  @Get('/search')
  async search(@Query('name') name: string, @Query('author') author?: string) {
    const books = await BookModel.find({ name, author })
    return books.map((book) => book.strippedAndFilled())
  }
}
