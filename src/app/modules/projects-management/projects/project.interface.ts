import { IEntity } from '../../../components/generic-crud/entity.interface';

export interface IProject extends IEntity {
  projectId?: string;
  customerId?: string;
  name: string;
  description: string;
}
