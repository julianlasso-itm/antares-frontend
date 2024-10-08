import { IAction } from '../table/action.interface';

export interface IEntity {
  status: boolean;
  actions?: IAction[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
