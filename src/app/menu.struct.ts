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
          'ANTARES :: Assessment Network for Technical Aptitude and Resource Evaluation System',
        path: 'dashboard',
        icon: 'dashboard',
        loadComponent: () =>
          import('./components').then((component) => component.HomeComponent),
      },
      {},
      {
        title: 'Clientes',
        path: 'customers',
        icon: 'people',
        loadComponent: () =>
          import('./modules').then((component) => component.CustomersComponent),
      },
      {
        title: 'Equipos',
        path: 'squads',
        icon: 'group',
        loadComponent: () =>
          import('./modules').then((component) => component.SquadsComponent),
      },
      {},
      {
        title: 'Profesionales',
        path: 'professionals',
        icon: 'people',
        loadComponent: () =>
          import('./modules').then(
            (component) => component.ProfessionalsComponent
          ),
      },
      {
        title: 'Habilidades',
        path: 'skills',
        icon: 'build',
        loadComponent: () =>
          import('./modules').then((component) => component.SkillsComponent),
      },
      {
        title: 'Roles',
        path: 'roles',
        icon: 'lock',
        loadComponent: () =>
          import('./modules').then((component) => component.RolesComponent),
      },
      {},
      {
        title: 'Preguntas',
        path: 'questions',
        icon: 'help',
        loadComponent: () =>
          import('./modules').then((component) => component.QuestionsComponent),
      },
      {},
      {
        title: 'Evaluaciones',
        path: 'assessments',
        icon: 'assignment',
        loadComponent: () =>
          import('./modules').then(
            (component) => component.AssessmentsComponent
          ),
      },
      {
        title: 'Resultados',
        path: 'results',
        icon: 'bar_chart',
        loadComponent: () =>
          import('./modules').then((component) => component.ResultsComponent),
      },
      {
        title: 'Cierre de brechas',
        path: 'gap-closure',
        icon: 'build',
        loadComponent: () =>
          import('./modules').then(
            (component) => component.GapClosureComponent
          ),
      },
    ],
  },
  // {
  //   title: 'Reportes',
  //   icon: 'description',
  //   path: 'reports',
  //   children: [
  //     {
  //     },
  //   ],
  // },
  {
    title: 'Configuración del sistema',
    icon: 'settings',
    path: 'settings',
    children: [
      {
        title: 'Usuarios',
        path: 'settings/users',
        icon: 'people',
        loadComponent: () =>
          import('./modules/security').then(
            (component) => component.UsersComponent
          ),
      },
      {
        title: 'Roles',
        path: 'settings/roles',
        icon: 'lock',
        loadComponent: () =>
          import('./modules/security').then(
            (component) => component.RolesComponent
          ),
      },
    ],
  },
];
