import { IEntity } from '../../../components/generic-crud/entity.interface';

export interface IAssessment extends IEntity {
  assessmentId: string;
  rolePerProfessionalId: string;
  userId: string;
  observations: string | null;
  score: string;
  startDate: Date;
  endDate: Date | null;
  rolePerProfessional: IRolePerProfessional;
}

export interface IRolePerProfessional {
  rolePerProfessionalId: string;
  professionalId: string;
  roleId: string;
  startDate: Date;
  endDate: Date | null;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: null;
  professional: IProfessional;
  role: IRole;
}

export interface IProfessional {
  professionalId: string;
  documentType: string;
  document: string;
  name: string;
  email: string;
  photo: string | null;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: null;
}

export interface IRole {
  roleId: string;
  name: string;
  description: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: null;
}
