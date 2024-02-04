import { IsOptional, IsString } from 'amala'

export default class UserBody {
  @IsString()
  @IsOptional()
  firstName!: string
  @IsString()
  @IsOptional()
  lastName!: string
  @IsString()
  @IsOptional()
  patronymic?: string
  @IsString()
  @IsOptional()
  class?: string
  @IsString()
  @IsOptional()
  token?: string
}

// this is here for "example" reasons
