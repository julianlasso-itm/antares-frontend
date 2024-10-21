import { IEntity } from '../../../components/generic-crud/entity.interface';

export interface ITechnologyStack extends IEntity {
  technologyStackId?: string;
  projectId: string;
  technologyTypeId?: string;
  technologyItemId: string;
  weight: number;
  technologyItem?: {
    name: string;
    technologyType: {
      technologyTypeId: string;
      name: string;
    };
  };
  customerId?: string;
  project?: {
    customerId: string;
    name: string;
  };
}
