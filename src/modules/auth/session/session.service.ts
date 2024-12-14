import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { User } from 'src/core/prisma/__generated__';
import { RedisService } from 'src/core/redis/redis.service';
import { getSessionMetadata } from 'src/modules/libs/common/utils/get-session-metada';
import { Session } from 'src/shared/types/session.types';

@Injectable()
export class SessionService {
  public constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  public async findCurrent(req: Request) {
    const sessionId = req.session.id;

    const sessionData = await this.redisService.get(
      this.configService.getOrThrow<string>('SESSION_PREFIX') + sessionId,
    );

    if (!sessionData) {
      throw new NotFoundException('Сессия не найдена');
    }

    const session = JSON.parse(sessionData);

    return {
      id: sessionId,
      ...session,
    };
  }

  public async findAll(userId: string) {
    let cursor = '0';
    const userSessions: Session[] = [];
    const pattern = '*';

    do {
      const [newCursor, keys] = await this.redisService.scan(
        cursor,
        'MATCH',
        pattern,
      );

      cursor = newCursor;

      for (const key of keys) {
        const sessionData = await this.redisService.get(key);
        if (!sessionData) {
          continue;
        }

        const session = JSON.parse(sessionData);

        if (session.userId === userId) {
          userSessions.push({
            id: key.split(':')[1],
            ...session,
          });
        }
      }
    } while (cursor !== '0');

    if (userSessions.length === 0) {
      throw new NotFoundException('Сессии для данного пользователя не найдены');
    }

    userSessions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return userSessions;
  }

  public async remove(id: string, req: Request) {
    if (id === req.session.id)
      throw new ConflictException('Текущую сессию нельзя удалить.');

    const userSessionId = req.session.id;

    const userSessionData = await this.redisService.get(
      this.configService.getOrThrow<string>('SESSION_PREFIX') + userSessionId,
    );
    if (!userSessionData) {
      throw new NotFoundException('Сессия не найдена');
    }

    const userSession = JSON.parse(userSessionData);

    const removeUserSessionData = await this.redisService.get(
      this.configService.getOrThrow<string>('SESSION_PREFIX') + id,
    );
    if (!removeUserSessionData) {
      throw new NotFoundException('Сессия не найдена');
    }

    const removeUserSession = JSON.parse(removeUserSessionData);

    if (userSession.userId !== removeUserSession.userId)
      throw new ConflictException(
        'Вы не можете сбросить сессии другого аккаунта.',
      );

    await this.redisService.del(
      `${this.configService.getOrThrow<string>('SESSION_PREFIX')}${id}`,
    );

    return { message: 'Сессия успешно удалена.' };
  }

  public async logout(req: Request): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException('Не удалось завершить сессию'),
          );
        }
        req.res.clearCookie(
          this.configService.getOrThrow<string>('SESSION_NAME'),
        );
        resolve();
      });
    });
  }

  public async saveSession(userAgent: string, req: Request, user: User) {
    const metadata = getSessionMetadata(req, userAgent);

    return new Promise((resolve, reject) => {
      req.session.createdAt = new Date();
      req.session.metadata = metadata;
      req.session.userId = user.id;
      req.session.save((saveErr) => {
        if (saveErr) {
          return reject(
            new InternalServerErrorException(
              'Не удалось сохранить данные сессии.',
            ),
          );
        }
        resolve({ user });
      });
    });
  }
}
