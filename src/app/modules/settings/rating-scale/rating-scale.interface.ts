import { IEntity } from '../../../components/generic-crud/entity.interface';

export interface IRatingScale extends IEntity {
  ratingScaleId?: string;
  configurationLevelId: string;
  name: string;
  description: string;
  value: number;
  position: number;
  configurationLevel?: { name: string };
}
