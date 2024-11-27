import { Controller } from '@nestjs/common';
import { StreamService } from './stream.service';

@Controller('streams')
export class StreamController {
  public constructor(private readonly streamService: StreamService) {}

  
}
