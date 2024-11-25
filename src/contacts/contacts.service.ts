import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { SearchContactDto } from './dto/search-contact.dto';
import { FilterContactDto } from './dto/filter-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create(createContactDto);
    return await this.contactRepository.save(contact);
  }

  async findAll(): Promise<Contact[]> {
    return await this.contactRepository.find();
  }

  async findOne(id: number): Promise<Contact> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact with id ${id} not found`);
    }
    return contact;
  }

  async update(
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    const contact = await this.contactRepository.preload({
      id,
      ...updateContactDto,
    });
    if (!contact) {
      throw new NotFoundException(`Contact with id ${id} not found`);
    }
    return await this.contactRepository.save(contact);
  }

  async remove(id: number): Promise<void> {
    const result = await this.contactRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Contact with id ${id} not found`);
    }
  }

  async search(criteria: SearchContactDto): Promise<Contact[]> {
    const { email, phoneNumber } = criteria;

    const where: FindOptionsWhere<Contact>[] = [];

    if (email) {
      where.push({ email });
    }

    if (phoneNumber) {
      where.push({ workPhone: phoneNumber });
      where.push({ personalPhone: phoneNumber });
    }

    const results = await this.contactRepository.find({
      where: where.length > 1 ? where : where[0],
    });

    if (results.length === 0) {
      throw new NotFoundException('No contact found with the given criteria.');
    }

    return results;
  }

  async filter(criteria: FilterContactDto): Promise<Contact[]> {
    const { state, city } = criteria;

    const where: FindOptionsWhere<Contact> = {};

    if (state) {
      where.state = state;
    }
    if (city) {
      where.city = city;
    }

    const results = await this.contactRepository.find({ where });

    if (results.length === 0) {
      throw new NotFoundException(
        'No contacts found for the given state or city.',
      );
    }

    return results;
  }
}
