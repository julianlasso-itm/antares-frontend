import { Routes } from '@angular/router';
import { titleGuard } from '../../guards/title.guard';
import { MenuItem, menuStruct } from '../../menu.struct';

export const routesDashboard: Routes = [];

menuStruct.forEach((menu) => {
  menu.children.forEach((element) => {
    if ((element as MenuItem).loadComponent) {
      routesDashboard.push({
        title: (element as MenuItem).titleWindow ?? (element as MenuItem).title,
        path: (element as MenuItem).path,
        loadComponent: (element as MenuItem).loadComponent,
        canActivate: [titleGuard],
      });
    }
  });
});

routesDashboard.push({
  path: 'settings/levels/:configurationLevelId',
  title: 'Niveles',
  loadComponent: () =>
    import('../../modules/settings/levels/levels.component').then(
      (component) => component.LevelsComponent
    ),
});

routesDashboard.push({
  path: 'assessment-history/:rolePerProfessionalId',
  title: 'Historial de evaluaciones',
  loadComponent: () =>
    import(
      '../../modules/assessments/assessments/assessment-history/assessment-history.component'
    ).then((component) => component.AssessmentHistoryComponent),
});

routesDashboard.push({
  path: 'assessment-execution/:rolePerProfessionalId',
  title: 'Evaluación de ',
  loadComponent: () =>
    import(
      '../../modules/assessments/assessments/assessment-execution/assessment-execution.component'
    ).then((component) => component.AssessmentExecutionComponent),
});

routesDashboard.push({
  path: 'knowledge-gaps/gaps/:professionalId',
  title: 'Brechas de conocimiento',
  loadComponent: () =>
    import(
      '../../modules/knowledge-gaps/knowledge-gaps/knowledge-gaps.component'
    ).then((component) => component.KnowledgeGapsComponent),
});

routesDashboard.push({
  path: 'knowledge-gaps/notes/:knowledgeGapId',
  title: 'Seguimiento de brechas',
  loadComponent: () =>
    import(
      '../../modules/knowledge-gaps/knowledge-gap-notes/knowledge-gap-notes.component'
    ).then((component) => component.KnowledgeGapNotesComponent),
});

routesDashboard.push({ path: '', redirectTo: 'dashboard', pathMatch: 'full' });
routesDashboard.push({ path: '**', redirectTo: 'dashboard' });
