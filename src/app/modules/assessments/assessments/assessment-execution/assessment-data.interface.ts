export interface IAssessmentData {
  configurationLevelId: string;
  domainKnowledges: IDomainKnowledgeData[];
  observations: string;
  rolePerProfessionalId: string;
  score: number;
  startDate: string;
  userId: string;
  status: boolean;
  endDate: string | null;
}

export interface IDomainKnowledgeData {
  domainAssessmentScoreId: string | null;
  domainKnowledgeId: string;
  observations: string;
  score: number;
  rating: number;
}

export interface IAssessmentDataServer {
  assessmentId: string;
  createdAt: Date;
  deletedAt: null;
  domainAssessmentScores: IDomainAssessmentScore[];
  endDate: Date | null;
  observations: string | null;
  rolePerProfessionalId: string;
  score: string;
  startDate: Date;
  status: boolean;
  updatedAt: Date | null;
  userId: string;
}

export interface IDomainAssessmentScore {
  assessmentId: string;
  configurationLevelId: string;
  createdAt: Date;
  deletedAt: null;
  domainAssessmentScoreId: string;
  domainKnowledgeId: string;
  observations: string;
  rating: string;
  score: number;
  status: boolean;
  updatedAt: Date | null;
}
