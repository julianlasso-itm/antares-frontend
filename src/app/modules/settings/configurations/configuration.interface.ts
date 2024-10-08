import { IEntity } from '../../../components/generic-crud/entity.interface';

export interface IConfiguration extends IEntity {
  configurationLevelId?: string;
  name: string;
}
