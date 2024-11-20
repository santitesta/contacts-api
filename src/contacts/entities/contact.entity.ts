import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  company: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ unique: true })
  email: string;

  @Column()
  birthdate: Date;

  @Column()
  workPhone: string;

  @Column()
  personalPhone: string;

  @Column()
  address: string;
}
