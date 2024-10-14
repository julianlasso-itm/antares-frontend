import { IEntity } from '../../../components/generic-crud/entity.interface';

export interface IDomainKnowledgeLevel extends IEntity {
  technologyTypeId?: string;
  technologyItemId?: string;
  domainKnowledgeId: string;
  domainKnowledgeLevelId: string;
  configurationLevelId: string;
  levelId: string;
  domainKnowledge?: DomainKnowledge;
  level?: Level;
  configurationLevel?: ConfigurationLevel;
}

export interface DomainKnowledge {
  domainKnowledgeId: string;
  domain: string;
  technologyItem: TechnologyItem;
}

export interface TechnologyItem {
  technologyItemId: string;
  name: string;
  technologyType: TechnologyType;
}

export interface TechnologyType {
  technologyTypeId: string;
  name: string;
}

export interface Level {
  levelId: string;
  name: string;
}

export interface ConfigurationLevel {
  configurationLevelId: string;
  name: string;
}
