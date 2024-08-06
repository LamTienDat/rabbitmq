import {
  Controller,
  Query,
  Param,
  Body,
  Get,
  Post,
  Patch,
  Delete,
  Request,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorator';
import { RoleEnum } from 'src/enum/role.enum';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { AuthUserDto } from './dtos/auth.user.dto';
import { PaginateDto } from 'src/base/dtos/paginate.dto';
import { AuthUser } from 'src/decorator/auth.user.decorator';

@Controller('/v1/user')
@ApiTags('User')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Roles(RoleEnum.ADMIN)
  @Post()
  async create(@Body() userData: CreateUserDto) {
    try {
      const create = await this.userService.createUser(userData);
      return create;
    } catch (error) {
      throw new HttpException(
        {
          errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorMessage: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get('profile')
  async getProfile(@Request() req) {
    try {
      const user = await this.userService.findOne(req);
      if (!user) {
        return {
          errorCode: HttpStatus.NOT_FOUND,
          errorMessage: 'user-not-found',
        };
      }
      return user;
    } catch (error) {
      throw new HttpException(
        {
          errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorMessage: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Patch('updateUser/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() user: AuthUserDto,
  ): Promise<any> {
    try {
      const updated = await this.userService.updateUser(
        id,
        updateUserDto,
        user,
      );
      if (!updated) {
        return {
          errorCode: HttpStatus.NOT_FOUND,
          message: 'user-not-found',
        };
      }
      return updated;
    } catch (err) {
      throw new HttpException(
        {
          errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorMessage: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Roles(RoleEnum.ADMIN)
  @Delete('delete/:id')
  async deleteUser(@Param('id') id: number) {
    try {
      const deleted = await this.userService.deleteUser(id);
      return deleted;
    } catch (error) {
      throw new HttpException(
        {
          errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorMessage: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Roles(RoleEnum.ADMIN)
  @Patch('activeUser/:id')
  async activeUser(@Param('id') id: number): Promise<any> {
    try {
      const create = await this.userService.activeUser(id);
      return create;
    } catch (error) {
      throw new HttpException(
        {
          errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorMessage: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Roles(RoleEnum.ADMIN)
  @Get('getActiveUsers')
  async getActiveUsers(): Promise<any> {
    const users = await this.userService.getActiveUsers();
    return users;
  }

  @Roles(RoleEnum.ADMIN)
  @Get('getAllUsers')
  async getAllUsers(@Query() paginate: PaginateDto): Promise<any> {
    try {
      const users = await this.userService.getAllUsers(paginate);
      return users;
    } catch (error) {
      throw new HttpException(
        {
          errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorMessage: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
