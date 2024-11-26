import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ModeratorService } from 'src/modules/channel/moderator/moderator.service';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ModeratorService],
  imports: [UserModule],
})
export class ChatModule {}
