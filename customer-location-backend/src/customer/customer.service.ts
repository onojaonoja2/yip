import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async create(customer: Customer): Promise<Customer> {
    const createdCustomer = new this.customerModel(customer);
    return createdCustomer.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 5,
  ): Promise<{ customers: Customer[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const customers = await this.customerModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();
    const totalCount = await this.customerModel.countDocuments().exec();
    return { customers, totalCount };
  }

  async countAll(): Promise<number> {
    return this.customerModel.countDocuments().exec();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }
    return customer;
  }

  async update(id: string, customer: Customer): Promise<Customer> {
    const updatedCustomer = await this.customerModel
      .findByIdAndUpdate(id, customer, { new: true })
      .exec();
    if (!updatedCustomer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }
    return updatedCustomer;
  }

  async remove(id: string): Promise<void> {
    const result = await this.customerModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }
  }
}
