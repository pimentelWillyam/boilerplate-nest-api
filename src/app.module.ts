import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './modules/user/user.module'
import { AppConfig } from './config/app-config'
import { DatabaseModule } from './infra/database/database.module'

@Module({
  imports: [ConfigModule.forRoot(AppConfig.getConfigModuleOptions()), DatabaseModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
