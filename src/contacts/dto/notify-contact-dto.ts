// src/contacts/dto/notify-contacts.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ContactDto {
  @ApiProperty({
    description: "The contact's name",
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: "The contact's email address",
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: "The contact's age",
    example: 30,
  })
  age: number;
}

export class NotifyContactDto {
  @ApiProperty({
    description:
      'The message template with placeholders to replace with contact data.',
    example: 'Congratulations <%= name %>! Today you turn <%= age %>!',
  })
  messageTemplate: string;

  @ApiProperty({
    description: 'The list of contacts to notify.',
    type: [ContactDto],
    example: [
      { name: 'John Doe', email: 'john.doe@example.com', age: 30 },
      { name: 'Jane Smith', email: 'jane.smith@example.com', age: 25 },
    ],
  })
  contacts: ContactDto[];
}
