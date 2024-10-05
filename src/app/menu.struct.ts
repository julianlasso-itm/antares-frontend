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
        title: 'Evaluaciones',
        path: 'assessments',
        icon: 'assignment',
        loadComponent: () =>
          import(
            './modules/assessments/assessments/assessments.component'
          ).then((component) => component.AssessmentsComponent),
      },
      {
        title: 'Brechas de conocimiento',
        path: 'knowledge-gaps',
        icon: 'network_intelligence_update',
        loadComponent: () =>
          import(
            './modules/knowledge-gaps/knowledge-gaps/knowledge-gaps.component'
          ).then((component) => component.KnowledgeGapsComponent),
      },
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
        title: 'Profesionales',
        path: 'projects/professionals',
        icon: 'groups',
        loadComponent: () =>
          import(
            './modules/projects-management/role-per-professional/role-per-professional.component'
          ).then((component) => component.RolePerProfessionalComponent),
      },
      {
        title: 'Stack tecnológico',
        path: 'projects/technology-stack',
        icon: 'settings',
        loadComponent: () =>
          import(
            './modules/projects-management/technology-stack/technology-stack.component'
          ).then((component) => component.TechnologyStackComponent),
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
        title: 'Dominios de Conocimiento',
        path: 'technologies/domains',
        icon: 'domain_verification',
        loadComponent: () =>
          import(
            './modules/domain-knowledge/domain-knowledge/domain-knowledge.component'
          ).then((component) => component.DomainKnowledgeComponent),
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
        title: 'Usuarios',
        path: 'settings/users',
        icon: 'people',
        loadComponent: () =>
          import('./modules/security/users/users.component').then(
            (component) => component.SecurityUsersComponent
          ),
      },
    ],
  },
];
