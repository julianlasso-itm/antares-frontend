export interface ItemByCompletedAssessment {
  technologyItemId: string;
  technologyTypeId: string;
  name: string;
  description: null | string;
  icon: null | string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  domainKnowledges: DomainKnowledge[];
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
  domainAssessmentScores: DomainAssessmentScore[];
}

export interface DomainAssessmentScore {
  domainAssessmentScoreId: string;
  assessmentId: string;
  domainKnowledgeId: string;
  configurationLevelId: string;
  observations: string;
  score: string;
  rating: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  assessment: Assessment;
}

export interface Assessment {
  assessmentId: string;
  rolePerProfessionalId: string;
  userId: string;
  observations: null | string;
  score: string;
  startDate: Date;
  endDate: Date;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}
