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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Contact } from './entities/contact.entity';
import { IdParamDto } from './dto/id-param.dto';

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
}
