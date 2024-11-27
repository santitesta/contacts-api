import { ApiProperty } from '@nestjs/swagger';
import { Contact } from '../entities/contact.entity';

export class PaginatedContactsDto {
  @ApiProperty({ description: 'List of contacts for the current page' })
  contacts: Contact[];

  @ApiProperty({
    description:
      'Cursor for the next page. Null if no more pages are available.',
  })
  nextCursor: number | null;
}
