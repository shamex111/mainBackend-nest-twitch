import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class NotificationService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async create(
    forUserId: string,
    fromUserId: string,
    content: string,
    link?: string,
  ) {
    await this.prismaService.notification.create({
      data: {
        forUserId,
        fromUserId,
        content,
        link,
      },
    });
  }
}
