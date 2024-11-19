import { IEntity } from '../../../components/generic-crud/entity.interface';

export interface IKnowledgeGap extends IEntity {
  knowledgeGapId?: string;
  assessmentId?: string;
  domainKnowledgeId?: string;
  title: string;
  observation: string;
  technologyItemId?: string;
  assessment?: object;
}
