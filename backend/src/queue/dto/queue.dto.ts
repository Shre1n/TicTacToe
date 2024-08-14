import { QueueEntryDto } from './queueEntry.dto';
import { ApiProperty } from '@nestjs/swagger';

export class QueueDto {
  @ApiProperty({ description: 'Queue Entries', type: [QueueEntryDto] })
  queueEntries: QueueEntryDto[];
}
