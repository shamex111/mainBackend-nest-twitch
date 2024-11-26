import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ModeratorService } from './moderator.service';
import { Authorization } from 'src/modules/auth/decorators/auth.decorator';
import { Authorized } from 'src/modules/auth/decorators/authorized.decorator';
import { AssignModeratorDto } from './dto/assignModerator.dto';
import { RemoveModeratorDto } from './dto/removeModerator.dto';
import { BanDto } from './dto/ban.dto';
import { CheckUserStatusDto } from './dto/checkUserStatus.dto';
import { UnbanDto } from './dto/unban.dto';

@Controller('moderators')
export class ModeratorController {
  public constructor(private readonly moderatorService: ModeratorService) {}

  @Authorization()
  @Post('assign')
  @HttpCode(HttpStatus.OK)
  public async assign(
    @Authorized('id') userId: string,
    @Body() dto: AssignModeratorDto,
  ) {
    return this.moderatorService.assignModerator(dto, userId);
  }

  @Authorization()
  @Delete('remove')
  @HttpCode(HttpStatus.OK)
  public async remove(
    @Authorized('id') userId: string,
    @Body() dto: RemoveModeratorDto,
  ) {
    return this.moderatorService.removeModerator(dto, userId);
  }

  @Authorization()
  @Get('check-user-status')
  public async checkStatus(
    @Authorized('id') userId: string,
    @Body() dto: CheckUserStatusDto,
  ) {
    return this.moderatorService.checkIsUserBannedOrMuted(userId, dto);
  }

  @Authorization()
  @Post('ban')
  @HttpCode(HttpStatus.OK)
  public async ban(@Authorized('id') userId: string, @Body() dto: BanDto) {
    return this.moderatorService.ban(dto, userId);
  }

  @Authorization()
  @Delete('unban')
  @HttpCode(HttpStatus.OK)
  public async unban(@Authorized('id') userId: string, @Body() dto: UnbanDto) {
    return this.moderatorService.unban(dto, userId);
  }
}
