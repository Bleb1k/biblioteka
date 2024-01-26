import { IsDate, IsISO8601, IsOptional, IsString } from 'amala'

export default class BookInfo {
  @IsString()
  user!: string
  @IsString()
  book!: string
  @IsString()
  @IsISO8601({ strict: true })
  returnDate!: string
  // @IsString()
  // @IsISO8601({ strict: true })
  // @IsOptional()
  // retrievalDate?: string
}

// this is here for "example" reasons
