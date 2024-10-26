import { IEntity } from '../../../components/generic-crud/entity.interface';

export interface IRolePerProfessional extends IEntity {
  customerId?: string;
  projectId?: string;
  rolePerProfessionalId?: string;
  professionalId: string | { value: string; label: string };
  roleId: string;
  startDate: string;
  endDate?: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  role?: Role;
  professional?: Professional;
}

interface Role {
  roleId: string;
  name: string;
  technologyPerRoles: TechnologyPerRole[];
}

interface TechnologyPerRole {
  technologyPerRoleId: string;
  technologyStack: TechnologyStack;
}

interface TechnologyStack {
  technologyStackId: string;
  project: Project;
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

interface Professional {
  professionalId: string;
  name: string;
}
