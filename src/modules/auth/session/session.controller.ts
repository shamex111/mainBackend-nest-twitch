import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { SessionService } from './session.service';
import { Authorization } from '../decorators/auth.decorator';
import { Authorized } from '../decorators/authorized.decorator';
import type { Request } from 'express';

@Controller('sessions')
export class SessionController {
  public constructor(private readonly sessionService: SessionService) {}

  @Authorization()
  @Get('all-sessions')
  public async allSessions(@Authorized('id') userId: string) {
    return this.sessionService.findAll(userId);
  }
  @Authorization()
  @Get('current-session')
  public async currentSession(@Req() req: Request) {
    return this.sessionService.findCurrent(req);
  }

  @Authorization()
  @Post('remove/:id')
  public async remove(@Param('id') id: string, @Req() req: Request) {
    return this.sessionService.remove(id, req);
  }

  @Post('logout')
  public async logout(@Req() req: Request) {
    return this.sessionService.logout(req);
  }
}
