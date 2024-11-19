export interface MenuItem {
  title: string;
  titleWindow?: string;
  icon: string;
  path: string;
  children?: MenuItem[];
  loadComponent?: () => Promise<any>;
}

export interface MenuStruct {
  title: string;
  icon: string;
  path: string;
  children: MenuElement[];
}

export interface MenuSeparator {}

export type MenuElement = MenuItem | MenuSeparator;

export const menuStruct: MenuStruct[] = [
  {
    title: 'Inicio',
    icon: 'home',
    path: '',
    children: [
      {
        title: 'Dashboard',
        titleWindow:
          'ANTARES - Assessment Network for Technical Aptitude and Resource Evaluation System',
        path: 'dashboard',
        icon: 'dashboard',
        loadComponent: () =>
          import('./modules/home/home.component').then(
            (component) => component.HomeComponent
          ),
      },
      // {},
      {
        title: 'Profesionales',
        path: 'human-resources/professionals',
        icon: 'groups',
        loadComponent: () =>
          import(
            './modules/human-resources/professionals/professionals.component'
          ).then((component) => component.ProfessionalsComponent),
      },
      {
        title: 'Evaluaciones',
        path: 'assessments',
        icon: 'assignment',
        loadComponent: () =>
          import(
            './modules/assessments/assessments/assessments.component'
          ).then((component) => component.AssessmentsComponent),
      },
      // {
      //   title: 'Brechas de conocimiento',
      //   path: 'knowledge-gaps/gaps/:professionalId',
      //   icon: 'network_intelligence_history',
      //   loadComponent: () =>
      //     import(
      //       './modules/knowledge-gaps/knowledge-gaps/knowledge-gaps.component'
      //     ).then((component) => component.KnowledgeGapsComponent),
      // },
      // {
      //   title: 'Seguimiento de brechas',
      //   path: 'knowledge-gaps/notes',
      //   icon: 'network_intelligence_update',
      //   loadComponent: () =>
      //     import(
      //       './modules/knowledge-gaps/knowledge-gap-notes/knowledge-gap-notes.component'
      //     ).then((component) => component.KnowledgeGapNotesComponent),
      // },
    ],
  },
  {
    title: 'Proyectos',
    icon: 'widgets',
    path: 'projects',
    children: [
      {
        title: 'Clientes',
        path: 'projects/customers',
        icon: 'people',
        loadComponent: () =>
          import(
            './modules/projects-management/customers/customers.component'
          ).then((component) => component.CustomersComponent),
      },
      {
        title: 'Proyectos',
        path: 'projects/projects',
        icon: 'inventory',
        loadComponent: () =>
          import(
            './modules/projects-management/projects/projects.component'
          ).then((component) => component.ProjectsComponent),
      },
      {
        title: 'Roles',
        path: 'projects/roles',
        icon: 'verified_user',
        loadComponent: () =>
          import('./modules/projects-management/roles/roles.component').then(
            (component) => component.RolesComponent
          ),
      },
      {
        title: 'Stack tecnológico',
        path: 'projects/technology-stack',
        icon: 'stack',
        loadComponent: () =>
          import(
            './modules/projects-management/technology-stack/technology-stack.component'
          ).then((component) => component.TechnologyStackComponent),
      },
      {
        title: 'Stack tecnológico por rol',
        path: 'projects/technology-per-role',
        icon: 'layers',
        loadComponent: () =>
          import(
            './modules/projects-management/technology-per-role/technology-per-role.component'
          ).then((component) => component.TechnologyPerRoleComponent),
      },
      {
        title: 'Profesionales y Roles',
        path: 'projects/professionals',
        icon: 'groups',
        loadComponent: () =>
          import(
            './modules/projects-management/role-per-professional/role-per-professional.component'
          ).then((component) => component.RolePerProfessionalComponent),
      },
    ],
  },
  {
    title: 'Dominios de Conocimiento',
    icon: 'build',
    path: 'technologies',
    children: [
      {
        title: 'Tipos de tecnologías',
        path: 'technologies/types',
        icon: 'auto_stories',
        loadComponent: () =>
          import(
            './modules/technologies/technology-types/technology-types.component'
          ).then((component) => component.TechnologyTypesComponent),
      },
      {
        title: 'Tecnologías',
        path: 'technologies/technologies',
        icon: 'military_tech',
        loadComponent: () =>
          import(
            './modules/technologies/technology-items/technology-items.component'
          ).then((component) => component.TechnologyItemsComponent),
      },
      {
        title: 'Dominios de conocimiento',
        path: 'technologies/domains',
        icon: 'domain_verification',
        loadComponent: () =>
          import(
            './modules/domain-knowledge/domain-knowledge/domain-knowledge.component'
          ).then((component) => component.DomainKnowledgeComponent),
      },
      // {
      //   title: 'Dom. de con. por nivel',
      //   path: 'technologies/domain-knowledge-levels',
      //   icon: 'host',
      //   loadComponent: () =>
      //     import(
      //       './modules/domain-knowledge/domain-knowledge-levels/domain-knowledge-levels.component'
      //     ).then((component) => component.DomainKnowledgeLevelsComponent),
      // },
      {
        title: 'Preguntas y respuestas',
        path: 'technologies/domain-questions-answers',
        icon: 'quiz',
        loadComponent: () =>
          import(
            './modules/domain-knowledge/domain-questions-answers/domain-questions-answers.component'
          ).then((component) => component.DomainQuestionsAnswersComponent),
      },
    ],
  },
  // {
  //   title: 'Reportes',
  //   icon: 'description',
  //   path: 'reports',
  //   children: [],
  // },
  {
    title: 'Configuración del sistema',
    icon: 'settings',
    path: 'settings',
    children: [
      {
        title: 'Configuraciones',
        icon: 'settings',
        path: 'settings/configurations',
        loadComponent: () =>
          import(
            './modules/settings/configurations/configurations.component'
          ).then((component) => component.ConfigurationsComponent),
      },
      {
        title: 'Niveles',
        path: 'settings/levels',
        icon: 'altitude',
        loadComponent: () =>
          import('./modules/settings/levels/levels.component').then(
            (component) => component.LevelsComponent
          ),
      },
      {
        title: 'Nivel por configuración',
        path: 'settings/configuration-per-level',
        icon: 'perm_data_setting',
        loadComponent: () =>
          import(
            './modules/settings/configuration-per-level/configuration-per-level.component'
          ).then((component) => component.ConfigurationPerLevelComponent),
      },
      {
        title: 'Escala de calificación',
        path: 'settings/rating-scale',
        icon: 'scale',
        loadComponent: () =>
          import('./modules/settings/rating-scale/rating-scale.component').then(
            (component) => component.RatingScaleComponent
          ),
      },
      // {
      //   title: 'Usuarios',
      //   path: 'settings/users',
      //   icon: 'people',
      //   loadComponent: () =>
      //     import('./modules/security/users/users.component').then(
      //       (component) => component.SecurityUsersComponent
      //     ),
      // },
    ],
  },
];
