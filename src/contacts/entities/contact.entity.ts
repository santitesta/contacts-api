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
  @Column()
  workPhone: string;

  @ApiProperty({ description: 'Personal phone number', example: '0987654321' })
  @Column()
  personalPhone: string;

  @ApiProperty({ description: 'Full address', example: '123 Main St' })
  @Column()
  address: string;
}
