import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Authorization } from 'src/modules/auth/decorators/auth.decorator';
import { Authorized } from 'src/modules/auth/decorators/authorized.decorator';
import { FollowDto } from './dto/follow.dto';
import { UnfollowDto } from './dto/unfollow.dto';
import { CreateDescriptionPartDto } from './dto/createDescriptionPart.dto';
import { DeleteDescriptionPartDto } from './dto/deleteDescriptionPart.dto';
import { CreateEmoteDto } from './dto/createEmote.dto';
import { DeleteEmoteDto } from './dto/deleteEmote.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('channels')
export class ChannelController {
  public constructor(private readonly channelService: ChannelService) {}

  @Authorization()
  @Post('follow')
  @HttpCode(HttpStatus.OK)
  public async follow(
    @Authorized('id') userId: string,
    @Body() dto: FollowDto,
  ) {
    return this.channelService.follow(dto, userId);
  }

  @Authorization()
  @Delete('unfollow')
  @HttpCode(HttpStatus.OK)
  public async unfollow(
    @Authorized('id') userId: string,
    @Body() dto: UnfollowDto,
  ) {
    return this.channelService.unfollow(dto, userId);
  }

  @Authorization()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
      },
    }),
  )
  @Post('create-description-part')
  @HttpCode(HttpStatus.OK)
  public async createDescriptionPart(
    @Authorized('id') userId: string,
    @Body() dto: CreateDescriptionPartDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /\/(jpg|jpeg|png|webp)$/,
          }),
          new MaxFileSizeValidator({
            maxSize: 1000 * 1000 * 3,
            message: 'Можно загружать файлы не больше 3 МБ',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.channelService.createDescriptionPart(dto, userId, file);
  }

  @Authorization()
  @Delete('delete-description-part')
  @HttpCode(HttpStatus.OK)
  public async deleteDescriptionPart(
    @Authorized('id') userId: string,
    @Body() dto: DeleteDescriptionPartDto,
  ) {
    return this.channelService.deleteDescriptionPart(dto, userId);
  }

  @Authorization()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
      },
    }),
  )
  @Post('create-emote')
  @HttpCode(HttpStatus.OK)
  public async createEmote(
    @Authorized('id') userId: string,
    @Body() dto: CreateEmoteDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /\/(jpg|jpeg|png|webp)$/,
          }),
          new MaxFileSizeValidator({
            maxSize: 1000 * 1000 * 2,
            message: 'Можно загружать файлы не больше 2 МБ',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.channelService.createEmote(dto, userId, file);
  }

  @Authorization()
  @Delete('delete-emote')
  @HttpCode(HttpStatus.OK)
  public async deleteEmote(
    @Authorized('id') userId: string,
    @Body() dto: DeleteEmoteDto,
  ) {
    return this.channelService.deleteEmote(dto, userId);
  }
}
