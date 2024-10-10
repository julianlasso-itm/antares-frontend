import { IEntity } from '../../../components/generic-crud/entity.interface';

export interface IConfigurationPerLevel extends IEntity {
  configurationPerLevelId?: string;
  configurationLevelId: string;
  levelId: string;
  position: number;
  configurationLevel?: { name: string };
  level?: { name: string };
}
