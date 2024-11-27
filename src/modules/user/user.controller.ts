import { Body, Controller, FileTypeValidator, Get, HttpCode, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorization } from 'src/modules/auth/decorators/auth.decorator';
import { Authorized } from 'src/modules/auth/decorators/authorized.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express'
import { User } from 'src/core/prisma/__generated__';
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
	@UseInterceptors(
		FileInterceptor('file', {
			limits: {
				files: 1
			}
		})
	)
	@Patch('update-avatar')
	@HttpCode(HttpStatus.OK)
	public async changeAvatar(
		@Authorized() user: User,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new FileTypeValidator({
						fileType: /\/(jpg|jpeg|png|webp)$/
					}),
					new MaxFileSizeValidator({
						maxSize: 1000 * 1000 * 3,
						message: 'Можно загружать файлы не больше 3 МБ'
					})
				]
			})
		)
		file: Express.Multer.File
	) {
		return this.userService.changeAvatar(user, file)
	}

  @Authorization()
  @Get('by-email/:email')
  public async findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }
}
