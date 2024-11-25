import {
  IsOptional,
  IsEmail,
  IsString,
  ValidateIf,
  IsNotEmpty,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchContactDto {
  @ApiProperty({
    description: 'Email of the contact to search for',
    required: false,
    example: 'john.doe@example.com',
  })
  @ValidateIf((o) => !o.phoneNumber)
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({
    message: 'Email must not be empty if phoneNumber is not provided',
  })
  email?: string;

  @ApiProperty({
    description: 'Phone number of the contact to search for',
    required: false,
    example: '1234567890',
  })
  @ValidateIf((o) => !o.email)
  @IsString({ message: 'Phone number must be a string' })
  @IsNotEmpty({
    message: 'Phone number must not be empty if email is not provided',
  })
  phoneNumber?: string;
}
