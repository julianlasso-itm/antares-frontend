export interface IQuestionsAndAnswersWithLevel {
  rolePerProfessionalId: string;
  professionalId: string;
  roleId: string;
  startDate: Date;
  endDate: Date | null;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: null;
  professional: Professional;
  role: Role;
}

interface Professional {
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

interface TechnologyItem {
  technologyItemId: string;
  technologyTypeId: string;
  name: string;
  description: string | null;
  icon: string | null;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: null;
  technologyType: Role;
  domainKnowledges: DomainKnowledge[];
}

interface TechnologyStack {
  technologyStackId: string;
  technologyItemId: string;
  projectId: string;
  weight: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: null;
  technologyItem: TechnologyItem;
}

interface TechnologyPerRole {
  technologyPerRoleId: string;
  technologyStackId: string;
  roleId: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: null;
  technologyStack: TechnologyStack;
}

interface Role {
  roleId?: string;
  name: string;
  description: string | null;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: null;
  technologyPerRoles?: TechnologyPerRole[];
  technologyTypeId?: string;
}

interface DomainKnowledge {
  domainKnowledgeId: string;
  technologyItemId: string;
  domain: string;
  weight: string;
  topic: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: null;
  domainKnowledgeLevels: DomainKnowledgeLevel[];
}

interface DomainKnowledgeLevel {
  domainKnowledgeLevelId: string;
  domainKnowledgeId: string;
  configurationLevelId: string;
  levelId: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: null;
  level: Level;
  domainQuestionsAnswers: DomainQuestionsAnswer[];
}

interface DomainQuestionsAnswer {
  domainQuestionAnswerId: string;
  domainKnowledgeId: null | string;
  domainKnowledgeLevelId: string;
  question: string;
  answer: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: null;
}

interface Level {
  levelId: string;
  name: string;
  weight: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: null;
}
