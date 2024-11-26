import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorization } from 'src/modules/auth/decorators/auth.decorator';
import { Authorized } from 'src/modules/auth/decorators/authorized.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Authorization()
  @Get('profile')
  public async profile(@Authorized('id') userId: string) {
    return this.userService.findById(userId);
  }

  @Authorization()
  @Patch('update')
  public async update(
    @Body() dto: UpdateUserDto,
    @Authorized('id') userId: string,
  ) {
    return this.userService.update(dto, userId);
  }

  @Authorization()
  @Get('by-email/:email')
  public async findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }
}
