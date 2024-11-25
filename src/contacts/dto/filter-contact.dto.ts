import { IsString, ValidateIf, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterContactDto {
  @ApiProperty({
    description:
      'State to filter contacts by (following ISO 3166-2. e.g.: CA for California)',
    required: false,
    example: 'CA',
  })
  @ValidateIf((o) => !o.city)
  @IsString({ message: 'State must be a string' })
  @IsNotEmpty({ message: 'State must not be empty if city is not provided' })
  state?: string;

  @ApiProperty({
    description: 'City to filter contacts by',
    required: false,
    example: 'San Francisco',
  })
  @ValidateIf((o) => !o.state)
  @IsString({ message: 'City must be a string' })
  @IsNotEmpty({ message: 'City must not be empty if state is not provided' })
  city?: string;
}
