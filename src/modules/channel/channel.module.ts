import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { UserService } from 'src/modules/user/user.service';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService],
  imports: [UserModule],
})
export class ChannelModule {}
