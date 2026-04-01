import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserResponseDto } from './dto/user-response.dto'

const SALT_ROUNDS = 10

function toUserResponse(user: User): UserResponseDto {
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
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { login: createUserDto.login }],
    })

    if (existingUser) {
      const field =
        existingUser.email === createUserDto.email ? 'email' : 'login'
      throw new ConflictException(`O ${field} informado já está em uso`)
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, SALT_ROUNDS)

    const user = this.userRepository.create({
      email: createUserDto.email,
      login: createUserDto.login,
      password: hashedPassword,
    })

    await this.userRepository.save(user)

    return toUserResponse(user)
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    })
    return users.map(toUserResponse)
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`)
    }

    return toUserResponse(user)
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`)
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailInUse = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      })
      if (emailInUse) {
        throw new ConflictException('O email informado já está em uso')
      }
    }

    if (updateUserDto.login && updateUserDto.login !== user.login) {
      const loginInUse = await this.userRepository.findOne({
        where: { login: updateUserDto.login },
      })
      if (loginInUse) {
        throw new ConflictException('O login informado já está em uso')
      }
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, SALT_ROUNDS)
    }

    if (updateUserDto.email) {
      user.email = updateUserDto.email
    }

    if (updateUserDto.login) {
      user.login = updateUserDto.login
    }

    const updatedUser = await this.userRepository.save(user)

    return toUserResponse(updatedUser)
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`)
    }

    await this.userRepository.remove(user)
  }
}
