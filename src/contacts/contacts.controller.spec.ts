import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { Contact } from './entities/contact.entity';
import { NotFoundException } from '@nestjs/common';

const mockContactsService = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('ContactsController', () => {
  let controller: ContactsController;
  let service: jest.Mocked<ContactsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        {
          provide: ContactsService,
          useFactory: mockContactsService,
        },
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
    service = module.get(ContactsService) as jest.Mocked<ContactsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return the created contact', async () => {
      const createContactDto = {
        name: 'John Doe',
        company: 'Acme Corp',
        profileImage: 'http://example.com/image.jpg',
        email: 'john.doe@example.com',
        birthdate: '1990-01-01',
        workPhone: '1234567890',
        personalPhone: '0987654321',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
      };

      const savedContact = {
        id: 1,
        ...createContactDto,
        birthdate: new Date('1990-01-01'), // Convert birthdate string to Date object
      };

      service.create.mockResolvedValue(savedContact);

      const result = await controller.create(createContactDto);
      expect(result).toEqual(savedContact);
      expect(service.create).toHaveBeenCalledWith(createContactDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of contacts', async () => {
      const contacts = [{ id: 1, name: 'John Doe' } as Contact];
      service.findAll.mockResolvedValue(contacts);

      const result = await controller.findAll();
      expect(result).toEqual(contacts);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a contact if found', async () => {
      const contact = { id: 1, name: 'John Doe' } as Contact;
      service.findOne.mockResolvedValue(contact);

      const result = await controller.findOne({ id: '1' });
      expect(result).toEqual(contact);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if contact not found', async () => {
      service.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne({ id: '1' })).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should return the updated contact', async () => {
      const updateContactDto = {
        name: 'John Updated',
      };

      const updatedContact = {
        id: 1,
        name: 'John Updated',
        company: 'Acme Corp',
        profileImage: 'http://example.com/image.jpg',
        email: 'john.doe@example.com',
        birthdate: new Date('1990-01-01'), // Convert birthdate string to Date object
        workPhone: '1234567890',
        personalPhone: '0987654321',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
      } as Contact;

      service.update.mockResolvedValue(updatedContact);

      const result = await controller.update('1', updateContactDto);
      expect(result).toEqual(updatedContact);
      expect(service.update).toHaveBeenCalledWith(1, updateContactDto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with the correct id', async () => {
      service.remove.mockResolvedValue();

      await controller.remove({ id: '1' });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
