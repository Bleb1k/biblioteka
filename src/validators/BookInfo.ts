import { IsNumber, IsOptional, IsString } from 'amala'

export default class TelegramLogin {
  @IsString()
  name?: string
  @IsOptional()
  @IsString()
  author?: string
}
