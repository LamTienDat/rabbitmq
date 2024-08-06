import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, ILike, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { BCRYPT_SALT } from 'src/config/config';
import * as bcrypt from 'bcrypt';
import { AuthUserDto } from './dtos/auth.user.dto';
import { PaginateDto } from 'src/base/dtos/paginate.dto';
import { User } from './entity/user.entity';
import { RoleEnum } from 'src/enum/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernamePattern = /^[a-zA-Z0-9_]+$/;

      const existEmail = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
          deleted: false,
        },
      });

      if (existEmail) {
        return {
          errorCode: HttpStatus.BAD_REQUEST,
          errorMessage: 'email-exists',
        };
      }

      // Validate email
      if (!emailPattern.test(createUserDto.email)) {
        return {
          errorCode: HttpStatus.BAD_REQUEST,
          errorMessage: 'Invalid email format',
        };
      }

      const existUsername = await this.userRepository.findOne({
        where: {
          username: createUserDto.username,
          deleted: false,
        },
      });
      if (existUsername) {
        return {
          errorCode: HttpStatus.BAD_REQUEST,
          errorMessage: 'username-exists',
        };
      }

      // Validate username
      if (!usernamePattern.test(createUserDto.username)) {
        return {
          errorCode: HttpStatus.BAD_REQUEST,
          errorMessage: 'invalid-characters',
        };
      }

      if (createUserDto.username && createUserDto.username.length < 2) {
        return {
          errorCode: HttpStatus.BAD_REQUEST,
          errorMessage: 'least-characters',
        };
      }

      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        BCRYPT_SALT,
      );
      createUserDto.password = hashedPassword;

      const newUser = this.userRepository.create({
        ...createUserDto,
        isActive: true,
      });
      await this.userRepository.save(newUser);
      return { statusCode: HttpStatus.OK, user: newUser };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(currentUser: any): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: currentUser.user.id,
          deleted: false,
        },
      });
      return { statusCode: HttpStatus.OK, user: { ...user } };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error finding user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneSignIn(emailOrUsername: string): Promise<any> {
    try {
      if (!emailOrUsername)
        throw new HttpException(
          'Email or Username is required',
          HttpStatus.BAD_REQUEST,
        );

      const user = await this.userRepository.findOne({
        where: [
          { email: emailOrUsername, isActive: true, deleted: false },
          { username: emailOrUsername, isActive: true, deleted: false },
        ],
      });
      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error finding user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async adminFindOne(email: string): Promise<User> {
    try {
      if (!email)
        throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);

      const user = await this.userRepository.findOne({
        where: {
          email: email,
          deleted: false,
        },
      });
      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error finding user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async activeUser(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: Equal(id),
          deleted: false,
        },
      });

      if (!user) {
        return {
          errorCode: HttpStatus.NOT_FOUND,
          errorMessage: 'user-not-found',
        };
      }

      user.isActive = true;
      await this.userRepository.save(user);

      return { statusCode: HttpStatus.OK, user };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error activating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getActiveUsers() {
    try {
      const users = await this.userRepository.find({
        where: { deleted: false },
        select: ['id', 'email', 'username', 'role', 'createdAt', 'updatedAt'], // exclude password
      });

      return {
        statusCode: HttpStatus.OK,
        users,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error getting users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUsers(paginate: PaginateDto) {
    try {
      const skip = (paginate.page - 1) * paginate.limit;

      const queryBuilder = this.userRepository.createQueryBuilder('user');

      queryBuilder
        .where('user.deleted = :deleted', { deleted: false })
        .andWhere('user.role != :role', { role: RoleEnum.ADMIN })
        .skip(skip)
        .take(paginate.limit)
        .select([
          'user.id',
          'user.email',
          'user.username',
          'user.role',
          'user.createdAt',
          'user.updatedAt',
        ]);

      if (paginate.search) {
        const escapedSearch = `%${paginate.search.replace(/[.*\+?^${}()|[\]\\]/g, '\\$&')}%`;
        queryBuilder.andWhere(
          '(user.username ILIKE :search OR user.email ILIKE :search)',
          { search: escapedSearch },
        );
      }

      const [users, total] = await queryBuilder.getManyAndCount();

      return {
        statusCode: HttpStatus.OK,
        users,
        page: paginate.page as number,
        limit: paginate.limit as number,
        total,
        totalPages: Math.ceil(total / paginate.limit),
        from: total > 0 ? skip + 1 : 0,
        to: Math.min(skip + paginate.limit, total),
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error getting users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    authUser: AuthUserDto,
  ) {
    try {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernamePattern = /^[a-zA-Z0-9_]+$/;

      const user = await this.userRepository.findOne({
        where: {
          id: id,
          deleted: false,
        },
      });

      if (!user) {
        return {
          errorCode: HttpStatus.NOT_FOUND,
          errorMessage: 'user-not-found',
        };
      }

      const existEmail = await this.userRepository.findOne({
        where: {
          email: updateUserDto.email,
          id: Not(id),
          deleted: false,
        },
      });

      if (existEmail) {
        return {
          errorCode: HttpStatus.BAD_REQUEST,
          errorMessage: 'email-exists',
        };
      }

      // Validate email
      if (!emailPattern.test(updateUserDto.email)) {
        return {
          errorCode: HttpStatus.BAD_REQUEST,
          errorMessage: 'invalid-characters',
        };
      }

      const existUsername = await this.userRepository.findOne({
        where: {
          username: updateUserDto.username,
          id: Not(id),
          deleted: false,
        },
      });
      if (existUsername) {
        return {
          errorCode: HttpStatus.BAD_REQUEST,
          errorMessage: 'username-exists',
        };
      }

      // Validate username
      if (!usernamePattern.test(updateUserDto.username)) {
        return {
          errorCode: HttpStatus.BAD_REQUEST,
          errorMessage: 'invalid-characters',
        };
      }

      if (updateUserDto.username && updateUserDto.username.length < 2) {
        return {
          errorCode: HttpStatus.BAD_REQUEST,
          errorMessage: 'least-characters',
        };
      }

      if (updateUserDto.password) {
        const hashedPassword = await bcrypt.hash(
          updateUserDto.password,
          BCRYPT_SALT,
        );
        updateUserDto.password = hashedPassword;
      }

      await this.userRepository.update(id, updateUserDto);

      const updatedUser = await this.userRepository.findOne({
        where: { id: id, deleted: false },
        select: ['id', 'email', 'username', 'role', 'createdAt', 'updatedAt'],
      });

      return { statusCode: HttpStatus.OK, user: updatedUser };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error updating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!user) {
        return {
          errorCode: HttpStatus.NOT_FOUND,
          errorMessage: 'user-not-found',
        };
      }

      await this.userRepository.delete(id);

      return {
        statusCode: HttpStatus.OK,
        user,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error deleting user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
