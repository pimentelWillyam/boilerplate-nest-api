import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['./src/modules/user/user.entity.ts'],
  migrations: ['./src/infra/database/migrations/*.ts'],
  synchronize: false,
  logging: false,
});