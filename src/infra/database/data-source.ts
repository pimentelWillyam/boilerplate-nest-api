import { DataSource } from 'typeorm';
import { User } from '../../modules/user/user.entity';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User],
  migrations: ['src/infra/database/migrations/*.ts'],
  synchronize: false,
  logging: false,
});
