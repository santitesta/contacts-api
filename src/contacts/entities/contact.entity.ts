import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Contact {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Name of the contact', example: 'John Doe' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Company name', example: 'Acme Corp' })
  @Column()
  company: string;

  @ApiProperty({
    description: 'Profile image URL',
    example: 'http://example.com/image.jpg',
  })
  @Column({ nullable: true })
  profileImage: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Birthdate in ISO format',
    example: '1990-01-01',
  })
  @Column()
  birthdate: Date;

  @ApiProperty({ description: 'Work phone number', example: '1234567890' })
  @Column({ unique: true })
  workPhone: string;

  @ApiProperty({ description: 'Personal phone number', example: '0987654321' })
  @Column({ unique: true })
  personalPhone: string;

  @ApiProperty({ description: 'Street address', example: '123 Main St' })
  @Column()
  street: string;

  @ApiProperty({ description: 'City', example: 'New York' })
  @Column()
  city: string;

  @ApiProperty({ description: 'State', example: 'NY' })
  @Column()
  state: string;

  @ApiProperty({ description: 'Postal code', example: '10001' })
  @Column()
  postalCode: string;

  @ApiProperty({ description: 'Country', example: 'USA' })
  @Column()
  country: string;
}
