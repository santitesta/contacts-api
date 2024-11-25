import { NotFoundException } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  delete: jest.fn(),
});

describe('ContactsService', () => {
  let service: ContactsService;
  let repository: jest.Mocked<Repository<Contact>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: getRepositoryToken(Contact),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
    repository = module.get(getRepositoryToken(Contact)) as jest.Mocked<
      Repository<Contact>
    >;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new contact', async () => {
      const createContactDto = {
        name: 'John Doe',
        company: 'Acme Corp',
        profileImage: 'http://example.com/image.jpg',
        email: 'john.doe@example.com',
        birthdate: '1990-01-01',
        workPhone: '1234567890',
        personalPhone: '0987654321',
        address: '123 Main St',
      };

      const savedContact = {
        id: 1,
        ...createContactDto,
        birthdate: new Date('1990-01-01'), // Convert birthdate string to Date object
      };

      repository.create.mockReturnValue(savedContact);
      repository.save.mockResolvedValue(savedContact);

      const result = await service.create(createContactDto);
      expect(result).toEqual(savedContact);

      expect(repository.create).toHaveBeenCalledWith(createContactDto);
      expect(repository.save).toHaveBeenCalledWith(savedContact);
    });

    it('should propagate a QueryFailedError for duplicate email', async () => {
      const createContactDto = {
        name: 'Jane Doe',
        company: 'Tech Corp',
        profileImage: 'http://example.com/jane.jpg',
        email: 'jane.doe@example.com', // Duplicate email
        birthdate: '1985-05-15',
        workPhone: '1112223333',
        personalPhone: '4445556666',
        address: '456 Tech St',
      };

      // Simulate a unique constraint violation (e.g., PostgreSQL error code '23505')
      const dbError = {
        code: '23505',
        detail: 'Key (email)=(jane.doe@example.com) already exists.',
        name: 'QueryFailedError',
        message:
          'duplicate key value violates unique constraint "contact_email_key"',
      };

      repository.create.mockReturnValue(createContactDto as any);
      repository.save.mockRejectedValue(dbError);

      await expect(service.create(createContactDto)).rejects.toEqual(dbError);

      expect(repository.create).toHaveBeenCalledWith(createContactDto);
      expect(repository.save).toHaveBeenCalledWith(createContactDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of contacts', async () => {
      const contacts = [{ id: 1, name: 'John Doe' } as Contact];
      repository.find.mockResolvedValue(contacts);

      const result = await service.findAll();
      expect(result).toEqual(contacts);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a contact if found', async () => {
      const contact = { id: 1, name: 'John Doe' } as Contact;
      repository.findOne.mockResolvedValue(contact);

      const result = await service.findOne(1);
      expect(result).toEqual(contact);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if contact not found', async () => {
      repository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update and return the contact if found', async () => {
      const updateContactDto = {
        company: 'Updated Company',
        email: 'updated.email@example.com',
        address: '123 New Street',
      };
      const contact = { id: 1, ...updateContactDto } as Contact;

      repository.preload.mockResolvedValue(contact);
      repository.save.mockResolvedValue(contact);

      const result = await service.update(1, updateContactDto);
      expect(result).toEqual(contact);
      expect(repository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateContactDto,
      });
      expect(repository.save).toHaveBeenCalledWith(contact);
    });

    it('should throw NotFoundException if contact not found', async () => {
      repository.preload.mockResolvedValue(undefined);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
      expect(repository.preload).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('remove', () => {
    it('should delete the contact if found', async () => {
      repository.delete.mockResolvedValue({ affected: 1, raw: true });

      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if contact not found', async () => {
      repository.delete.mockResolvedValue({ affected: 0, raw: true });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
