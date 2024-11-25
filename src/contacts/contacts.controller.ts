import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  NotFoundException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Contact } from './entities/contact.entity';
import { IdParamDto } from './dto/id-param.dto';
import { SearchContactDto } from './dto/search-contact.dto';
import { FilterContactDto } from './dto/filter-contact.dto';

@ApiTags('contacts')
@Controller()
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiCreatedResponse({
    description: 'The contact has been successfully created.',
    type: Contact,
  })
  @ApiBadRequestResponse({
    description: 'Validation error or database constraint violation',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Duplicate entry detected for "email".',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    content: {
      'application/json': {
        example: {
          statusCode: 500,
          message: 'Internal server error.',
        },
      },
    },
  })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all contacts' })
  @ApiResponse({
    status: 200,
    description: 'List of contacts retrieved successfully.',
    type: [Contact],
  })
  findAll() {
    return this.contactsService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contact by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID must be a number',
  })
  @ApiResponse({
    status: 200,
    description: 'Contact updated successfully.',
    type: Contact,
  })
  @ApiBadRequestResponse({
    description: 'Validation error.',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Invalid input data.',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Contact not found.',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: 'Contact with id 1 not found',
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(+id, updateContactDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a contact by ID' })
  @ApiResponse({
    status: 204,
    description: 'Contact deleted successfully.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID must be a number',
  })
  @ApiNotFoundResponse({
    description: 'Contact not found.',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: 'Contact with id 1 not found',
        },
      },
    },
  })
  remove(@Param() params: IdParamDto) {
    return this.contactsService.remove(+params.id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search for a contact by email or phone number' })
  @ApiResponse({
    status: 200,
    description: 'Contact(s) retrieved successfully.',
    type: [Contact],
  })
  @ApiBadRequestResponse({
    description: 'Validation error.',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Invalid query parameter.',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No contact found.',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: 'No contact found with the given criteria.',
        },
      },
    },
  })
  search(@Query() searchContactDto: SearchContactDto) {
    return this.contactsService.search(searchContactDto);
  }

  @Get('filter')
  @ApiOperation({
    summary: 'Retrieve all contacts from the same state or city',
  })
  @ApiResponse({
    status: 200,
    description: 'Contact(s) retrieved successfully.',
    type: [Contact],
  })
  @ApiBadRequestResponse({
    description: 'Validation error.',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'At least one of state or city is required.',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No contacts found.',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: 'No contacts found for the given state or city.',
        },
      },
    },
  })
  filter(@Query() filterContactDto: FilterContactDto) {
    return this.contactsService.filter(filterContactDto);
  }

  @Get('birthdays')
  @ApiOperation({
    summary: 'Get contacts with birthdays today or within the current month',
    description:
      'Returns a list of contacts whose birthdate is today or falls within the current month.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of contacts with upcoming or current month birthdays.',
    type: [Contact],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getBirthdays(): Promise<Contact[]> {
    return this.contactsService.getBirthdaysThisMonth();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID must be a number',
  })
  @ApiOperation({ summary: 'Retrieve a contact by ID' })
  @ApiResponse({
    status: 200,
    description: 'Contact retrieved successfully.',
    type: Contact,
  })
  @ApiNotFoundResponse({
    description: 'Contact not found.',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: 'Contact with id 1 not found',
        },
      },
    },
  })
  findOne(@Param() params: IdParamDto) {
    return this.contactsService.findOne(+params.id);
  }
}
