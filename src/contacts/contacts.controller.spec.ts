import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';

describe('ContactsController', () => {
  let controller: ContactsController;
  let service: ContactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        ContactsService,
        {
          provide: getRepositoryToken(Contact),
          useClass: Repository, // Use TypeORM Repository for the service
        },
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
    service = module.get<ContactsService>(ContactsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service and return the created contact', async () => {
      const createContactDto = {
        name: 'John Doe',
        company: 'Acme Corp',
        profileImage: 'http://example.com/image.jpg',
        email: 'john.doe@example.com',
        birthdate: '1990-01-01', // Keep as string for DTO compatibility
        workPhone: '1234567890',
        personalPhone: '0987654321',
        address: '123 Main St',
      };

      const savedContact = {
        ...createContactDto,
        id: 1,
        birthdate: new Date(createContactDto.birthdate), // Convert to Date for Contact compatibility
      };

      // Mock service method
      jest.spyOn(service, 'create').mockResolvedValue(savedContact as Contact);

      const result = await controller.create(createContactDto);
      expect(result).toEqual(savedContact);

      // Ensure the service's create method was called with the correct arguments
      expect(service.create).toHaveBeenCalledWith(createContactDto);
    });
  });
});
