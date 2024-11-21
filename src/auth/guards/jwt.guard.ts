import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err:Error, user:any, info:string) {
    if (err || !user) {
      throw new UnauthorizedException('Вы не авторизованы в системе.Пожалуйста, авторизуйтесь и повторите запрос.')
    }
    return user;
  }
}
