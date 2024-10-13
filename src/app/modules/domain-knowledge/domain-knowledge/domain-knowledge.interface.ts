import { IEntity } from '../../../components/generic-crud/entity.interface';

export interface IDomainKnowledge extends IEntity {
  domainKnowledgeId?: string;
  domain: string;
  weight?: number;
  topic: string;
  technologyTypeId?: string;
  technologyItemId: string;
  technologyItem?: {
    name: string;
    description?: string;
    technologyType?: {
      technologyTypeId: string;
      name: string;
      description?: string;
    };
  };
}
