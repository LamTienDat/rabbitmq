// src/seeder/user.seeder.ts
import { Command, CommandRunner } from 'nest-commander';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from 'src/enum/role.enum';
import { User } from '../users/entity/user.entity';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from 'src/config/database.config';

@Command({ name: 'seed:user' })
export class UserCommander extends CommandRunner {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    try {
      const email = ADMIN_EMAIL;
      const password = ADMIN_PASSWORD;
      const saltRounds =
        parseInt(this.configService.get<string>('BCRYPT_SALT'), 10) || 10;

      if (!email || !password) {
        throw new Error('Admin email or password is not defined');
      }

      // Tạo admin user
      const adminHashedPassword = await bcrypt.hash(password, saltRounds);
      const existingAdmin = await this.userRepository.findOneBy({
        email: email,
      });

      if (!existingAdmin) {
        const adminUser = this.userRepository.create({
          email: email,
          password: adminHashedPassword,
          role: RoleEnum.ADMIN,
          username: 'admin1',
          deleted: false,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await this.userRepository.save(adminUser);

        console.log('Admin user created');
      } else {
        console.log('Admin user already exists');
      }

      // Tạo 1000 user ngẫu nhiên
      for (let i = 1; i <= 1000; i++) {
        const userEmail = `user${i}@example.com`;
        const userPassword = `password${i}`;
        const username = `user${i}`;
        const hashedPassword = await bcrypt.hash(userPassword, saltRounds);

        const existingUser = await this.userRepository.findOneBy({
          email: userEmail,
        });

        if (!existingUser) {
          const user = this.userRepository.create({
            email: userEmail,
            password: hashedPassword,
            role: RoleEnum.USER,
            username: username,
            deleted: false,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          await this.userRepository.save(user);

          console.log(`User ${userEmail} created`);
        } else {
          console.log(`User ${userEmail} already exists`);
        }
      }
    } catch (error) {
      console.error('Error seeding users:', error);
      throw new Error(error.message || 'Error seeding users');
    }
  }
}
