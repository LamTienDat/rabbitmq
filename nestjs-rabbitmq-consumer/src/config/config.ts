import * as dotenv from 'dotenv';
dotenv.config();
export const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
export const RABBITMQ_PORT = parseInt(process.env.RABBITMQ_PORT) || 5672;
