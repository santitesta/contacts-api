import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ description: 'Name of the contact', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Company name', example: 'Acme Corp' })
  @IsString()
  company: string;

  @ApiProperty({
    description: 'Profile image URL',
    example: 'http://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Birthdate in ISO format',
    example: '1990-01-01',
  })
  @IsDateString()
  birthdate: string;

  @ApiProperty({ description: 'Work phone number', example: '1234567890' })
  @IsString()
  workPhone: string;

  @ApiProperty({ description: 'Personal phone number', example: '0987654321' })
  @IsString()
  personalPhone: string;

  @ApiProperty({ description: 'Street address', example: '123 Main St' })
  @IsString()
  street: string;

  @ApiProperty({ description: 'City', example: 'New York' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'State', example: 'NY' })
  @IsString()
  state: string;

  @ApiProperty({ description: 'Postal code', example: '10001' })
  @IsString()
  postalCode: string;

  @ApiProperty({ description: 'Country', example: 'USA' })
  @IsString()
  country: string;
}
