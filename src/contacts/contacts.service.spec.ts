import { BadRequestException } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ContactsService', () => {
  let service: ContactsService;
  let repository: Repository<Contact>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: getRepositoryToken(Contact),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
    repository = module.get<Repository<Contact>>(getRepositoryToken(Contact));
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
        ...createContactDto,
        id: 1,
        birthdate: new Date(createContactDto.birthdate),
      };

      jest.spyOn(repository, 'create').mockReturnValue(savedContact as any);
      jest.spyOn(repository, 'save').mockResolvedValue(savedContact);

      const result = await service.create(createContactDto as any);
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

      // Mock `repository.create` to return a valid object
      jest.spyOn(repository, 'create').mockReturnValue(createContactDto as any);

      // Simulate unique constraint violation (PostgreSQL code: 23505)
      const dbError = {
        code: '23505',
        detail: 'Key (email)=(jane.doe@example.com) already exists.',
      };
      jest.spyOn(repository, 'save').mockRejectedValue(dbError);

      // Expect the service to throw the database error (to be handled by the filter)
      await expect(service.create(createContactDto as any)).rejects.toEqual(
        dbError,
      );

      // Verify repository methods were called
      expect(repository.create).toHaveBeenCalledWith(createContactDto);
      expect(repository.save).toHaveBeenCalled();
    });
  });
});
