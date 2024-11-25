import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService],
  imports: [UserModule],       
})
export class ChannelModule {}
