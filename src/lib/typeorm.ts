// lib/typeorm.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AiChat } from '@/entities/AiChat';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'trivoh',
  synchronize: true,
  logging: false,
  entities: [AiChat],
});
