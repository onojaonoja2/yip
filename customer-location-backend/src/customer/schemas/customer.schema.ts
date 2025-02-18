import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema()
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  contact: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
