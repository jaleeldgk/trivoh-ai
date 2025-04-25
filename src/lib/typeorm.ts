// lib/typeorm.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AiChat } from '@/entities/AiChat';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '34.147.240.18',
  port: 3306,
  username: 'jaleel',
  password: 'GieiRDbbDiXGDbtN',
  database: 'trivoh_db',
  synchronize: true,
  logging: false,
  entities: [AiChat],
});
