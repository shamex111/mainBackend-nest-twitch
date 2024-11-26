import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly userService: UserService) {}

  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();

    if (req.session.userId === undefined)
      throw new UnauthorizedException(
        'Вы не зарегестрированы в системе.Пожалуйста, войдите в аккаунт и повторите запрос.',
      );
    const user = await this.userService.findById(req.session.userId);
    req.user = user;
    return true;
  }
}
