import { IEntity } from '../../../components/generic-crud/entity.interface';

interface DomainKnowledge {
  domainKnowledgeId: string;
  domain: string;
  technologyItem: TechnologyItem;
}

interface TechnologyItem {
  technologyItemId: string;
  technologyType: TechnologyType;
}

interface TechnologyType {
  technologyTypeId: string;
}

interface Level {
  levelId: string;
  name: string;
}

interface DomainKnowledgeLevel {
  domainKnowledgeLevelId: string;
  level: Level;
  domainKnowledge: DomainKnowledge;
}

export interface IDomainQuestionsAnswer extends IEntity {
  technologyTypeId?: string;
  technologyItemId?: string;
  levelId?: string;
  domainQuestionAnswerId?: string;
  domainKnowledgeId?: string | null;
  domainKnowledgeLevelId?: string | null;
  question: string;
  answer: string;
  domainKnowledge?: DomainKnowledge | null;
  domainKnowledgeLevel?: DomainKnowledgeLevel | null;
  domain?: string;
}
