import { IAction } from '../../../components/table/action.interface';

export interface IConfiguration {
  configurationLevelId?: string;
  name: string;
  status: boolean;
  actions?: IAction[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
