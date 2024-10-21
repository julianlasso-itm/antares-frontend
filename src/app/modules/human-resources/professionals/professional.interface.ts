import { IEntity } from '../../../components/generic-crud/entity.interface';
import { DocumentType } from './document-type.enum';

export interface IProfessional extends IEntity {
  professionalId?: string;
  documentType?: DocumentType;
  document?: string;
  fullName: string;
  email: string;
  photo: string;
}
