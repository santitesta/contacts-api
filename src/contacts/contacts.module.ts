import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { Contact } from './entities/contact.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),
    CacheModule.register({
      ttl: 3600, // cache time-to-live in seconds
    }),
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
