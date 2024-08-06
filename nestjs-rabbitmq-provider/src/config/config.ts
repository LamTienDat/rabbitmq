import * as dotenv from 'dotenv';
dotenv.config();
export const BCRYPT_SALT = parseInt(process.env.BCRYPT_SALT, 10) || 10;
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
export const RABBITMQ_PORT = parseInt(process.env.RABBITMQ_PORT) || 5672;
