// src/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AiChat } from './entities/AiChat';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'your_password',
  database: 'your_db_name',
  synchronize: true, // For dev only
  logging: false,
  entities: [AiChat],
});
