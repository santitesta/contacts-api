import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsEmail()
  email: string;

  @IsDateString()
  birthdate: string;

  @IsString()
  workPhone: string;

  @IsString()
  personalPhone: string;

  @IsString()
  address: string;
}
