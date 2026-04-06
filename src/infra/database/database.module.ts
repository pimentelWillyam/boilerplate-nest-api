import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../modules/user/user.entity'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV', 'dev')
        const isProd = nodeEnv === 'prod'

        return {
          url: configService.get<string>('DATABASE_URL'),
          entities: [User],
          logging: !isProd,
          type: 'postgres',
          synchronize: false,
        }
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
