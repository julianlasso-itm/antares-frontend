import { IEntity } from '../../../components/generic-crud/entity.interface';

export interface ILevel extends IEntity {
  levelId?: string;
  name: string;
  weight: number;
}
