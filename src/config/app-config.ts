type Environment = 'dev' | 'prod' | 'test'

const VALID_ENVIRONMENTS: Environment[] = ['dev', 'prod', 'test']

export class AppConfig {
  private static getEnvironment(): Environment {
    const env = process.env.NODE_ENV ?? 'dev'
    return VALID_ENVIRONMENTS.includes(env as Environment) ? (env as Environment) : 'dev'
  }

  private static getEnvFilePaths(env: Environment): string[] {
    return [`.env.${env}`, '.env']
  }

  private static createConfiguration() {
    return () => ({
      port: parseInt(process.env.PORT ?? '3000', 10),
      database: { url: process.env.DATABASE_URL },
    })
  }

  static getConfigModuleOptions() {
    const env = AppConfig.getEnvironment()
    return {
      isGlobal: true,
      load: [AppConfig.createConfiguration()],
      envFilePath: AppConfig.getEnvFilePaths(env),
      ignoreEnvFile: env === 'prod' && !process.env.DATABASE_URL?.startsWith('file:'),
    }
  }
}
