import { IsISO8601, IsOptional, IsString } from 'amala'

export default class BookInfo {
  @IsString()
  @IsOptional()
  token?: string
  @IsString()
  @IsOptional()
  user?: string
  @IsString()
  @IsOptional()
  book?: string
  @IsString()
  @IsOptional()
  @IsISO8601({ strict: true })
  returnDate?: string
  @IsString()
  @IsOptional()
  @IsISO8601({ strict: true })
  retrievalDate?: string
}

// this is here for "example" reasons
