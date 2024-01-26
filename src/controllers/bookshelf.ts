import { Body, Controller, Ctx, Get, Post, Query } from 'amala'
import { Context } from 'koa'
import { Book, BookModel, findBooks, findOrCreateBook } from '@/models/Book'
import { notFound } from '@hapi/boom'

/*
@Controller('/api/bookshelf')
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
@Controller('/bookshelf')
export default class BookshelfController {
  @Post('/')
  async newBook(@Body({ required: true }) body: Book) {
    const user = await findOrCreateBook(body)
    return user.strippedAndFilled()
  }

  @Get('/')
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
}
