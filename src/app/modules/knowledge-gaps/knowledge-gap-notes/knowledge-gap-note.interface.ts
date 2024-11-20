import { IEntity } from '../../../components/generic-crud/entity.interface';

export interface IKnowledgeGapNote extends IEntity {
  knowledgeGapNoteId?: string;
  knowledgeGapId?: string;
  userId?: string;
  observation: string;
  knowledgeGap: KnowledgeGap;
}

export interface KnowledgeGap {
  knowledgeGapId: string;
  assessmentId: string;
  domainKnowledgeId: string;
  title: string;
  observation: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: null;
}
