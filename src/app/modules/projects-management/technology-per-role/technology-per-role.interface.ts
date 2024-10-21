import { IEntity } from '../../../components/generic-crud/entity.interface';

export interface ITechnologyPerRole extends IEntity {
  technologyPerRoleId?: string;
  technologyStackId: string;
  roleId: string;
  customerId?: string;
  projectId?: string;
  technologyItemId?: string;
  role?: Role;
  technologyStack?: TechnologyStack;
}

interface Role {
  name: string;
}

interface TechnologyStack {
  weight: string;
  technologyItem: TechnologyItem;
  project: Project;
}

interface TechnologyItem {
  technologyItemId: string;
  name: string;
}

interface Project {
  projectId: string;
  name: string;
  customer: Customer;
}

interface Customer {
  customerId: string;
  name: string;
}
