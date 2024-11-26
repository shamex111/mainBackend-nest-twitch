import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateMessageDto } from './dto/createMessage.dto';
import { ModeratorService } from 'src/modules/channel/moderator/moderator.service';
import { DeleteMessageDto } from './dto/deleteMessage.dto';
import { PinnedMessageDto } from './dto/pinnedMessage.dto';
import { UnpinnedMessageDto } from './dto/unpinnedMessage.dto';

@Injectable()
export class ChatService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly moderatorService: ModeratorService,
  ) {}

  public async create(userId: string) {
    const isExist = await this.prismaService.chat.findFirst({
      where: {
        userId,
      },
    });
    if (isExist) throw new BadRequestException('У вас уже создан чат.');
    return this.prismaService.chat.create({
      data: {
        userId,
      },
    });
  }

  public async createMessage(userId: string, dto: CreateMessageDto) {
    const chat = await this.prismaService.chat.findFirst({
      where: {
        id: dto.chatId,
      },
    });

    if (!chat)
      throw new BadRequestException(
        'Чата с таким id для добавление сообщения нет.Пожалуйста, проверьте корректность введенных данных.',
      );

    const isUserHaveRule = await this.moderatorService.checkIsUserBannedOrMuted(
      userId,
      {
        streamerId: chat.userId,
      },
    );
    if (isUserHaveRule?.isUserBannedOrMuted)
      throw new BadRequestException(
        'Вы не можете отправлять сообщения в этот чат.',
      );

    const newMessage = await this.prismaService.message.create({
      data: {
        chatId: chat.id,
        senderId: userId,
        content: dto.content,
      },
    });
    if (dto?.replyMessageId) {
      const reply = await this.reply({
        originMessageId: newMessage.id,
        replyMessageId: dto.replyMessageId,
      });
      return this.findMessage(newMessage.id, '');
    }
    return newMessage;
  }
  public async deleteMessage(userId: string, dto: DeleteMessageDto) {
    const message = await this.findMessage(dto.messageId, 'удаления');
    const chat = await this.prismaService.chat.findUnique({
      where: {
        id: message.chatId,
      },
    });
    const moderator = await this.moderatorService.checkIsModerator(
      userId,
      chat.userId,
    );
    if (!moderator)
      throw new BadRequestException(
        'У вас не достаточно прав для выполнения этого действия.',
      );
    if (message.senderId === chat.userId && userId !== chat.userId)
      throw new BadRequestException(
        'Вы не можете удалять сообщения владельца канала.',
      );
    const isMessageSenderModerator =
      await this.moderatorService.checkIsModerator(
        message.senderId,
        chat.userId,
      );
    if (isMessageSenderModerator && userId !== chat.userId)
      throw new BadRequestException(
        'Вы не можете удалять сообщения других модераторов.',
      );
    await this.prismaService.message.delete({
      where: {
        id: message.id,
      },
    });
    return { message: 'Сообщение успешно удалено' };
  }

  public async pinnedMessage(userId: string, dto: PinnedMessageDto) {
    const message = await this.findMessage(dto.messageId, 'закрепления');
    const chat = await this.prismaService.chat.findUnique({
      where: {
        id: message.chatId,
      },
    });
    const moderator = await this.moderatorService.checkIsModerator(
      userId,
      chat.userId,
    );
    if (!moderator)
      throw new BadRequestException(
        'У вас не достаточно прав для выполнения этого действия.',
      );

    return this.prismaService.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        pinnedMessageId: message.id,
      },
    });
  }
  public async unpinnedMessage(userId: string, dto: UnpinnedMessageDto) {
    const message = await this.findMessage(dto.messageId, 'открепления');

    const chat = await this.prismaService.chat.findUnique({
      where: {
        id: message.chatId,
      },
    });
    const moderator = await this.moderatorService.checkIsModerator(
      userId,
      chat.userId,
    );
    if (!moderator)
      throw new BadRequestException(
        'У вас не достаточно прав для выполнения этого действия.',
      );

    await this.prismaService.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        pinnedMessageId: null,
      },
    });
    return { message: 'Сообщение успешно открепленно.' };
  }

  private async reply(data: {
    replyMessageId: string;
    originMessageId: string;
  }) {
    await this.findMessage(data.originMessageId, 'ответа');

    if (data.originMessageId === data.replyMessageId)
      throw new BadRequestException(
        'Вы не можете ответить на само же сообщение.',
      );

    return this.prismaService.message.update({
      where: {
        id: data.originMessageId,
      },
      data: {
        replyMessageId: data.replyMessageId,
      },
    });
  }

  private async findMessage(messageId: string, action: string) {
    const message = await this.prismaService.message.findUnique({
      where: {
        id: messageId,
      },
    });
    if (!message)
      throw new NotFoundException(`Сообщения для ${action} не найдено.`);
    return message;
  }
}
