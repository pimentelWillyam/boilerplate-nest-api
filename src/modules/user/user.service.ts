import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../infra/database/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserResponseDto } from './dto/user-response.dto'

const SALT_ROUNDS = 10

function toUserResponse(user: {
  id: string
  email: string
  login: string
  createdAt: Date
  updatedAt: Date
}): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    login: user.login,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { login: createUserDto.login },
        ],
      },
    })

    if (existingUser) {
      const field = existingUser.email === createUserDto.email ? 'email' : 'login'
      throw new ConflictException(`O ${field} informado já está em uso`)
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      SALT_ROUNDS,
    )

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        login: createUserDto.login,
        password: hashedPassword,
      },
    })

    return toUserResponse(user)
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return users.map(toUserResponse)
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`)
    }

    return toUserResponse(user)
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`)
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailInUse = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      })
      if (emailInUse) {
        throw new ConflictException('O email informado já está em uso')
      }
    }

    if (updateUserDto.login && updateUserDto.login !== user.login) {
      const loginInUse = await this.prisma.user.findUnique({
        where: { login: updateUserDto.login },
      })
      if (loginInUse) {
        throw new ConflictException('O login informado já está em uso')
      }
    }

    const data: { email?: string; login?: string; password?: string } = {
      ...updateUserDto,
    }

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, SALT_ROUNDS)
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    })

    return toUserResponse(updatedUser)
  }

  async remove(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`)
    }

    await this.prisma.user.delete({
      where: { id },
    })
  }
}
