import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV', 'dev')
        const isProd = nodeEnv === 'prod'

        return {
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [],
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
