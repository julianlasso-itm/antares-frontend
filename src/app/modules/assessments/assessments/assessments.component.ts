import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { GenericCrudComponent } from '../../../components/generic-crud/generic-crud.component';
import { IAction } from '../../../components/table/action.interface';
import { TableComponent } from '../../../components/table/table.component';
import { IRolePerProfessional } from '../../projects-management/role-per-professional/role-per-professional.interface';

@Component({
  selector: 'app-assessments',
  standalone: true,
  imports: [MatProgressSpinnerModule, TableComponent],
  templateUrl: '../../../components/generic-crud/generic-crud.component.html',
  styles: [
    `
      .content {
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: center;

        app-table {
          min-width: fit-content;
          width: 75%;
          max-width: 100%;
        }
      }
    `,
  ],
})
export class AssessmentsComponent extends GenericCrudComponent<IRolePerProfessional> {
  private readonly _router = inject(Router);

  constructor() {
    super();
    this.displayedColumns.set([
      { name: 'Profesional', field: 'professional.name' },
      { name: 'Rol', field: 'role.name' },
      {
        name: 'Proyecto',
        field: 'role.technologyPerRoles[0].technologyStack.project.name',
      },
      {
        name: 'Cliente',
        field:
          'role.technologyPerRoles[0].technologyStack.project.customer.name',
      },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend = `${environment.endpoint.projectsManagement.rolePerProfessional}?withDisabled=false&isActiveOnAccount=true`;
    this._searchBar$.placeholder =
      'Buscar un profesional y sus roles o un rol y sus profesionales o un cliente y sus profesionales por proyecto y roles';
    this._errorMessageLoad = 'Error al cargar los profesionales y sus roles';
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this._buttonHeader$.visibleAdd = false;
  }

  protected override getActions(entity: IRolePerProfessional): IAction[] {
    return [
      {
        icon: 'checklist',
        tooltip: 'Assessments',
        action: this.goToAssessmentHistory.bind(
          this,
          entity.rolePerProfessionalId ?? ''
        ),
      },
    ];
  }

  private goToAssessmentHistory(rolePerProfessionalId: string): void {
    this._router.navigate(['assessment-history', rolePerProfessionalId]);
  }
}
