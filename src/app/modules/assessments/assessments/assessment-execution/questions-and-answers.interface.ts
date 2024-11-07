export interface IQuestionsAndAnswers {
  assessments?: Assessment[];
  createdAt: Date;
  deletedAt: null;
  endDate: Date | null;
  professional: Professional;
  professionalId: string;
  role: Role;
  roleId: string;
  rolePerProfessionalId: string;
  startDate: Date;
  status: boolean;
  updatedAt: Date | null;
}

export interface Professional {
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

export interface TechnologyItem {
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

export interface TechnologyStack {
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

export interface TechnologyPerRole {
  technologyPerRoleId: string;
  technologyStackId: string;
  roleId: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: null;
  technologyStack: TechnologyStack;
}

export interface Role {
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

export interface DomainKnowledge {
  domainKnowledgeId: string;
  technologyItemId: string;
  domain: string;
  weight: string;
  topic: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: null;
  domainQuestionsAnswers: DomainQuestionsAnswer[];
}

export interface DomainQuestionsAnswer {
  domainQuestionAnswerId: string;
  domainKnowledgeId: string;
  domainKnowledgeLevelId: string | null;
  question: string;
  answer: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: null;
}

export interface Assessment {
  assessmentId: string;
  rolePerProfessionalId: string;
  userId: string;
  observations: string | null;
  score: string;
  startDate: Date;
  endDate: Date | null;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  domainAssessmentScores: DomainAssessmentScore[];
}

export interface DomainAssessmentScore {
  domainAssessmentScoreId: string;
  assessmentId: string;
  domainKnowledgeId: string;
  configurationLevelId: string;
  observations: string | null;
  score: string;
  rating: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: null;
}
