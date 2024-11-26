import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
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
  @Post('create-description-part')
  @HttpCode(HttpStatus.OK)
  public async createDescriptionPart(
    @Authorized('id') userId: string,
    @Body() dto: CreateDescriptionPartDto,
  ) {
    return this.channelService.createDescriptionPart(dto, userId);
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
  @Post('create-emote')
  @HttpCode(HttpStatus.OK)
  public async createEmote(
    @Authorized('id') userId: string,
    @Body() dto: CreateEmoteDto,
  ) {
    return this.channelService.createEmote(dto, userId);
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
