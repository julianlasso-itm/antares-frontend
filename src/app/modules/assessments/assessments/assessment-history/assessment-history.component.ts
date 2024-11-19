import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { GenericCrudComponent } from '../../../../components/generic-crud/generic-crud.component';
import { IAction } from '../../../../components/table/action.interface';
import { TableComponent } from '../../../../components/table/table.component';
import { IAssessment } from '../assessment.interface';

@Component({
  selector: 'app-assessment-history',
  standalone: true,
  imports: [MatProgressSpinnerModule, TableComponent],
  templateUrl:
    '../../../../components/generic-crud/generic-crud.component.html',
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
export class AssessmentHistoryComponent extends GenericCrudComponent<IAssessment> {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);

  constructor() {
    super();
    this.displayedColumns.set([
      { name: 'Nivel', field: 'score' },
      { name: 'Fecha inicio', field: 'startDate' },
      { name: 'Fecha fin', field: 'endDate' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._filter.set(
      this._activatedRoute.snapshot.paramMap.get('rolePerProfessionalId') ?? ''
    );
    this._searchBar$.disabled = true;
    this._menuService.title = 'Historial de evaluaciones';
    this._urlBackend = `${environment.endpoint.assessments.assessments}`;
    const transformers = new Array<Function>();
    transformers[0] = (element: IAssessment) => {
      return Number(element.score).toFixed(2);
    };
    transformers[1] = (element: IAssessment) => {
      return new Date(element.startDate).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };
    transformers[2] = (element: IAssessment) => {
      if (element.endDate) {
        return new Date(element.endDate).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
      return element.endDate;
    };
    this.transformers.set(transformers);
  }

  protected override OpenModalForCreate(): void {
    this._router.navigate(['assessment-execution', this._filter()]);
  }

  protected override getActions(entity: IAssessment): IAction[] {
    const professionalName = entity.rolePerProfessional.professional.name;
    if (professionalName) {
      this._menuService.title = `Historial de evaluaciones de ${professionalName}`;
    }

    if (!entity.endDate) {
      this._buttonHeader$.visibleAdd = false;
    }

    return [
      {
        icon: entity.endDate ? 'visibility' : 'resume',
        tooltip: entity.endDate ? 'Ver detalles' : 'Continuar',
        action: () => {
          this._router.navigate(['assessment-execution', entity.assessmentId]);
        },
      },
      {
        icon: 'delete',
        tooltip: 'Eliminar',
        action: this.OpenModalForDelete.bind(this, entity),
      },
    ];
  }
}
