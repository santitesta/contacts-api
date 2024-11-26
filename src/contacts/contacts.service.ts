import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { SearchContactDto } from './dto/search-contact.dto';
import { FilterContactDto } from './dto/filter-contact.dto';
import { getMonth } from 'date-fns';
import { template } from 'lodash';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  private readonly logger = new Logger(ContactsService.name);

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

  async getBirthdaysThisMonth(): Promise<Contact[]> {
    const today = new Date();
    const currentMonth = getMonth(today) + 1; // `getMonth` is 0-indexed, so add 1

    return this.contactRepository
      .createQueryBuilder('contact')
      .where('EXTRACT(MONTH FROM contact.birthdate) = :month', {
        month: currentMonth,
      })
      .getMany();
  }

  sendNotification(
    messageTemplate: string,
    contacts: { name: string; email: string; age: number }[],
  ): void {
    const compiledTemplate = template(messageTemplate);

    contacts.forEach((contact) => {
      const personalizedMessage = compiledTemplate(contact);

      // Simulate sending email
      this.logger.log(`Email sent to ${contact.email}: ${personalizedMessage}`);
    });
  }
}
