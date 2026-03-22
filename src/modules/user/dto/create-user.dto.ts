import { IsEmail, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  email!: string

  @IsString()
  login!: string

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password!: string
}
