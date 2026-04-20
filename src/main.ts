import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'

export class Application {
  private static getValidationPipe() {
    return new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  }

  static async execute() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(Application.getValidationPipe())
    const configService = app.get(ConfigService)
    const port = configService.get<number>('port') ?? 3000
    await app.listen(port)
    console.log(`Server is running on port ${port}`)
    console.log(
                `
                GET localhost:${port}/
                POST localhost:${port}/user
                GET localhost:${port}/user
                GET localhost:${port}/user/:id
                PATCH localhost:${port}/user/:id
                DELETE localhost:${port}/user/:id
                `
              )
  }
}

void Application.execute()
