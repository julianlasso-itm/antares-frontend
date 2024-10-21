export const environment = {
  production: true,
  apiUrl: 'https://antares.sofka.com.co',
  endpoint: {
    assessments: {
      assessments: '/assessments/assessments',
      configurationPerLevel: '/assessments/configuration-per-level',
      configurations: '/assessments/configuration-levels',
      domainAssessmentScores: '/assessments/domain-assessment-scores',
      domainKnowledge: '/assessments/domain-knowledge',
      domainKnowledgeLevels: '/assessments/domain-knowledge-levels',
      domainQuestionsAnswers: '/assessments/domain-questions-answers',
      findOne: {
        domainKnowledgeLevels: '/assessments/domain-knowledge-levels/find-one',
      },
      levels: '/assessments/levels',
      ratingScale: '/assessments/rating-scale',
    },
    humanResources: {
      professionals: '/human-resources/professionals',
    },
    knowledgeGaps: {
      gaps: '/knowledge-gaps/gaps',
      notes: '/knowledge-gaps/notes',
    },
    projectsManagement: {
      customers: '/projects-management/customers',
      projects: '/projects-management/projects',
      rolePerProfessional: '/projects-management/role-per-professional',
      roles: '/projects-management/roles',
      technologyPerRole: '/projects-management/technology-per-role',
      technologyStack: '/projects-management/technology-stack',
      findOne: {
        technologyStack: '/projects-management/technology-stack/find-one',
      },
    },
    security: {
      roles: '/security/roles',
      userPerRole: '/security/user-per-role',
      users: '/security/users',
    },
    technologies: {
      items: '/technologies/items',
      types: '/technologies/types',
    },
  },
  googleId: {
    issuer: 'https://accounts.google.com',
    clientId:
      '166154982577-5kbga8vkagep2jbuk8r0l99b6b5edinf.apps.googleusercontent.com',
    scope: 'openid email profile',
  },
};
