import { Module } from '@nestjs/common';
import { ModeratorService } from './moderator.service';
import { ModeratorController } from './moderator.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ModeratorController],
  providers: [ModeratorService],
  imports:[UserModule]
})
export class ModeratorModule {}
