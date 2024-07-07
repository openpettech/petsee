import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Delete,
  Param,
  NotFoundException,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import {
  ContactDto,
  CreateContactRequest,
  UpdateContactRequest,
} from '@contracts/customer';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { ContactService } from '../services';

@ApiTags('Customer')
@Controller('contacts')
@UseGuards(AuthGuard('bearer'))
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(private readonly contactService: ContactService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(ContactDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.contactService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ContactDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.contactService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Contact not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ContactDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createContactDto: CreateContactRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.contactService.create(context, {
      ...createContactDto,
      projectId: context.projectId,
      createdBy: triggeredBy,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: ContactDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateContactDto: UpdateContactRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
    @Param('id') id: string,
  ) {
    return this.contactService.update(context, {
      id,
      projectId: context.projectId,
      ...updateContactDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: ContactDto,
  })
  async delete(
    @Ctx() context: Context,
    @TriggeredBy() triggeredBy: ServiceRole,
    @Param('id') id: string,
  ) {
    return this.contactService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: triggeredBy,
    });
  }
}
