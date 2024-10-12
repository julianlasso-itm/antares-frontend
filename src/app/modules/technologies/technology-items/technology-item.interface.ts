import { IEntity } from '../../../components/generic-crud/entity.interface';

export interface ITechnologyItem extends IEntity {
  technologyItemId?: string;
  name: string;
  description?: string;
  // icon?: string;
  technologyTypeId: string;
  technologyType?: { name: string };
}
