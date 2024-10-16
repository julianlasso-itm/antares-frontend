import { IEntity } from '../../../components/generic-crud/entity.interface';

export interface ICustomer extends IEntity {
  customerId?: string;
  name: string;
}
