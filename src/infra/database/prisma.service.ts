import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../../prisma/generated/prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('database.url')
    const adapter = new PrismaPg({ connectionString: connectionString! })
    super({ adapter })
  }

  async onModuleInit() {
    await this.$connect()
  }
}