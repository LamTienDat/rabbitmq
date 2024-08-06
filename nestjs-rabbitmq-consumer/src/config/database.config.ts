import * as dotenv from 'dotenv';
dotenv.config();
export const DATABASE_HOST = process.env.DATABASE_HOST || '127.0.0.1';
export const DATABASE_PORT = process.env.DATABASE_PORT || 5432;
export const DATABASE_USERNAME = process.env.DATABASE_USERNAME || 'postgres';
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || 'root';
export const DATABASE_NAME = process.env.DATABASE_NAME || 'postgres';
