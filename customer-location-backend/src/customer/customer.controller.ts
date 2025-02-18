import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './schemas/customer.schema';
import { ParseObjectIdPipe } from './parse-object-id.pipe';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() customer: Customer) {
    return this.customerService.create(customer);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.customerService.findAll(page, limit);
  }

  @Get('count')
  async countAll(): Promise<{ count: number }> {
    const count = await this.customerService.countAll();
    return { count };
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<Customer> {
    try {
      return await this.customerService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() customer: Customer,
  ): Promise<Customer> {
    try {
      return await this.customerService.update(id, customer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    try {
      await this.customerService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }
}
