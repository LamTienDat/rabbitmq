import { BCRYPT_SALT } from './config';
export const appConfig = (): Record<string, any> => ({
  bcryptSalt: BCRYPT_SALT || 10,
  minPasswordLength: 8,
  maxPasswordLength: 24,
});
