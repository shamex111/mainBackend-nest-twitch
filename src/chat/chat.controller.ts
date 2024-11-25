import { Body, Controller, Delete, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { CreateMessageDto } from './dto/createMessage.dto';
import { DeleteMessageDto } from './dto/deleteMessage.dto';
import { PinnedMessageDto } from './dto/pinnedMessage.dto';
import { UnpinnedMessageDto } from './dto/unpinnedMessage.dto';

@Controller('chats')
export class ChatController {
  public constructor(private readonly chatService: ChatService) {}

  @Authorization()
  @Post('create')
  @HttpCode(HttpStatus.OK)
  public async create(@Authorized('id') userId: string) {
    return this.chatService.create(userId);
  }

  @Authorization()
  @Post('create-message')
  @HttpCode(HttpStatus.OK)
  public async createMessage(
    @Authorized('id') userId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.chatService.createMessage(userId, dto);
  }

  @Authorization()
  @Delete('delete-message')
  @HttpCode(HttpStatus.OK)
  public async deleteMessage(
    @Authorized('id') userId: string,
    @Body() dto: DeleteMessageDto,
  ) {
    return this.chatService.deleteMessage(userId, dto);
  }
  
  @Authorization()
  @Patch('pinned-message')
  @HttpCode(HttpStatus.OK)
  public async pinnedMessage(
    @Authorized('id') userId: string,
    @Body() dto: PinnedMessageDto,
  ) {
    return this.chatService.pinnedMessage(userId, dto);
  }

  @Authorization()
  @Patch('unpinned-message')
  @HttpCode(HttpStatus.OK)
  public async unpinnedMessage(
    @Authorized('id') userId: string,
    @Body() dto: UnpinnedMessageDto,
  ) {
    return this.chatService.unpinnedMessage(userId, dto);
  }
}
