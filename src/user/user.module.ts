import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TwoFactorAuthModule } from 'src/auth/two-factor-auth/two-factor-auth.module';

@Module({
  imports: [
    forwardRef(() => TwoFactorAuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], 
})
export class UserModule {}
