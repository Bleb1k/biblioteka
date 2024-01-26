import { IsNumber, IsOptional, IsString } from 'amala'

export default class BookInfo {
  @IsString()
  name!: string
  @IsOptional()
  @IsString()
  author?: string
}

// this is here for "example" reasons
