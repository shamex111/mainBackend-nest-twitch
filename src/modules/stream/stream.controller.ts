import { Controller } from '@nestjs/common';
import { StreamService } from './stream.service';
import { QualityEnum } from './enums/qualityEnum.enum';

@Controller('streams')
export class StreamController {
  public constructor(private readonly streamService: StreamService) {}

  public async start(userId: string, dto: any) {}

  public async stop(userId: string, dto: any) {}

  public async getStream(streamId: string) {}

  public async incrementViewers(streamId: string, userId: string) {}

  public async decrementViewers(streamId: string, userId: string) {}

  public async getTrack(streamId: string, quality: QualityEnum) {}

  public async getStatistics(streamStatsId: string, userId: string) {}
}
