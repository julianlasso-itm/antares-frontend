import { IEntity } from '../../../components/generic-crud/entity.interface';

export interface IRole extends IEntity {
  roleId?: string;
  name: string;
  description: string | null;
}
