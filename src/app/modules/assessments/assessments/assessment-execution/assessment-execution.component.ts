import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpParams } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { forkJoin, map, Observable, Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ButtonHeaderService } from '../../../../services/button-header.service';
import { FullViewportContentService } from '../../../../services/full-viewport-content.service';
import { HttpService } from '../../../../services/http.service';
import { MenuService } from '../../../../services/menu.service';
import { SearchBarService } from '../../../../services/search-bar.service';
import { IResponse } from '../../../response.interface';
import {
  IAssessmentData,
  IAssessmentDataServer,
  IDomainKnowledgeData,
} from './assessment-data.interface';
import {
  IFullConfiguration,
  RatingScale,
} from './full-configuration.interface';
import { PercentageCalculator } from './percentage-calculator.class';
import { QuestionsAndAnswersModalComponent } from './questions-and-answers-modal/questions-and-answers-modal.component';
import {
  DomainQuestionsAnswer,
  IQuestionsAndAnswers,
  TechnologyItem,
} from './questions-and-answers.interface';

@Component({
  selector: 'app-assessment-execution',
  standalone: true,
  imports: [
    BaseChartDirective,
    MatStepperModule,
    MatIconModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assessment-execution.component.html',
  styleUrl: './assessment-execution.component.scss',
})
export class AssessmentExecutionComponent {
  @Input() rolePerProfessionalId!: string;
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  @ViewChild('stepper') stepper!: MatStepper;

  private readonly _dialog = inject(MatDialog);
  private readonly _header$ = inject(MenuService);
  private readonly _searchBar$ = inject(SearchBarService);
  private readonly _fullViewportContent$ = inject(FullViewportContentService);
  private readonly _buttonHeader$ = inject(ButtonHeaderService);
  private readonly _http$ = inject(HttpService);
  private readonly _notification = inject(ToastrService);
  private readonly _router = inject(Router);
  private readonly _questionsAndAnswers = signal({} as IQuestionsAndAnswers);
  private readonly _fullConfiguration = signal({} as IFullConfiguration);
  private readonly _currentTechnologyItemIndex = signal(0);
  private readonly _score = signal<{ value: number; name: string }[]>([]);
  private readonly _percentageCalculator = signal<
    Map<string, PercentageCalculator>
  >(new Map());
  private readonly _getFormValue = (fieldName: string) =>
    this.formAssessment().get(fieldName)?.value;
  private readonly _getIsValidFromField = (fieldName: string) =>
    this.formAssessment().get(fieldName)?.valid;

  private readonly _generalLevel = signal(0);

  private readonly colorPalette: [string, string][] = [
    ['rgba(75, 75, 75, 0.025)', 'rgba(75, 75, 75, 0.35)'],
    ['rgba(255, 45, 45, 0.025)', 'rgba(255, 45, 45, 0.35)'],
    ['rgba(255, 206, 86, 0.025)', 'rgba(255, 206, 86, 0.35)'],
    ['rgba(75, 192, 192, 0.025)', 'rgba(75, 192, 192, 0.35)'],
  ];

  private readonly successMessages: string[] = [
    'Excelente trabajo',
    '¡Bien hecho!',
    'Lo lograste, felicidades',
    'Sigue así, vas genial',
    '¡Eres increíble!',
    'Buen progreso',
    'Estás logrando grandes cosas',
    'Superaste mis expectativas',
    'Increíble esfuerzo',
    'Gran avance',
    '¡Lo hiciste perfectamente!',
    'Tu esfuerzo da frutos',
    'Muy buen resultado',
    'Sigue destacándote',
    '¡Eso es tener éxito!',
    'Impresionante dedicación',
    'Tu talento brilla',
    'Vas por muy buen camino',
    'Orgulloso de tu logro',
    'Tu compromiso es admirable',
  ];

  private readonly errorMessages: string[] = [
    '¡Vaya, no te has podido!',
    'Error inesperado',
    'Algo ha ido mal',
    'Operación fallida',
    'Algo ha salido mal',
    'Operación cancelada',
    'Houston, we have a problem',
  ];

  formAssessment: WritableSignal<FormGroup>;
  private _formAssessmentSubscription = new Subscription();

  radarChartDatasets: WritableSignal<
    ChartConfiguration<'radar'>['data']['datasets']
  > = signal([
    {
      data: [],
      label: 'Evaluado',
      backgroundColor: 'rgba(0, 125, 255, 0.8)',
      borderColor: 'rgba(0, 125, 255, 1)',
    },
  ]);

  radarChartOptions: WritableSignal<ChartConfiguration<'radar'>['options']> =
    signal({
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              return this.calculateRanking(Number(context.formattedValue));
            },
          },
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          min: 0,
          max: 5,
          ticks: {
            display: false,
          },
        },
      },
    });

  radarChartLabels: WritableSignal<string[]>;
  radarChartType: WritableSignal<ChartConfiguration<'radar'>['type']> =
    signal('radar');

  constructor() {
    this._searchBar$.disabled = true;
    this._fullViewportContent$.fullViewportContent = true;
    this._buttonHeader$.visibleAdd = false;
    this._buttonHeader$.visibleAssistant = false;
    this.radarChartLabels = signal([]);
    this.formAssessment = signal(new FormGroup({}));
    this._buttonHeader$.visiblePartialSave = true;
    this._buttonHeader$.visibleSaveAndFinish = true;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this._header$.title = 'Evaluación de';
    });
    this._buttonHeader$.actionPartialSave = this.savePartial.bind(this);
    this._buttonHeader$.actionSaveAndFinish = this.saveAndFinish.bind(this);
    this.loadData();
  }

  ngOnDestroy(): void {
    this._buttonHeader$.visiblePartialSave = false;
    this._buttonHeader$.visibleSaveAndFinish = false;
    this._formAssessmentSubscription.unsubscribe();
  }

  openDialogQuestionsAndAnswers(data: DomainQuestionsAnswer[]): void {
    this.formAssessment().updateValueAndValidity();
    console.log('form', this.formAssessment());
    this._dialog.open(QuestionsAndAnswersModalComponent, {
      autoFocus: false,
      disableClose: true,
      data,
    });
  }

  getQuestionsAndAnswersAsArray(): TechnologyItem[] {
    const data: TechnologyItem[] = [];
    const technologyPerRoles =
      this._questionsAndAnswers()?.role?.technologyPerRoles;
    if (technologyPerRoles) {
      technologyPerRoles.forEach((technologyPerRole) => {
        data.push(technologyPerRole.technologyStack.technologyItem);
      });
    }
    return data;
  }

  getDescriptionFromTechnologyItem(technologyItem: TechnologyItem): boolean {
    return !!(
      technologyItem.description && technologyItem.description.length > 0
    );
  }

  getRatingScaleValue(): RatingScale[] {
    return this._fullConfiguration().ratingScales;
  }

  selectionChanged(selection: StepperSelectionEvent): void {
    this._currentTechnologyItemIndex.set(selection.selectedIndex);
    const stepId = this.stepper._getStepLabelId(selection.selectedIndex);
    const stepElement = document.getElementById(stepId);
    if (stepElement) {
      setTimeout(() => {
        stepElement.scrollIntoView({
          block: 'start',
          inline: 'nearest',
          behavior: 'smooth',
        });
      }, 250);
    }
  }

  ratingScaleValueChanged(value: number, technicalItem: TechnologyItem): void {
    if (value) {
      const positionInToGraph = Array.from(this.radarChartLabels()).indexOf(
        technicalItem.name
      );

      this.radarChartDatasets.update((currentDatasets) => {
        let score = 0;
        technicalItem.domainKnowledges.forEach((domainKnowledge, index) => {
          const valueFromForm = Number(
            this.formAssessment().get(
              `${domainKnowledge.domainKnowledgeId}_score`
            )?.value
          );

          const percentage = this._percentageCalculator().get(
            technicalItem.technologyItemId
          );
          if (percentage) {
            const scoreTemp = percentage.calculatePercentage(
              valueFromForm,
              index
            );
            score += scoreTemp;
            currentDatasets[0].data[positionInToGraph] = score;
          }
        });

        return currentDatasets;
      });

      this.updateTitle();
      this.chart.update();
    }
  }

  readonly observations = signal<Record<string, string>>({});

  onInputChange(event: Event, id: string): void {
    this.observations.update((observations) => {
      observations[id] = (event.target as HTMLInputElement).value;
      return observations;
    });
  }

  getLengthObservation(id: string): number {
    const observation = this.observations()[id];
    return observation ? observation.length : 0;
  }

  private savePartial(): void {
    const data = this.createDataForSave();
    let url = `${environment.endpoint.assessments.assessmentPartialSave}`;
    let httpService = this._http$.post<
      IAssessmentData,
      IResponse<IAssessmentDataServer>
    >(url, data);
    const assessmentId = this.formAssessment().get('assessmentId')?.value;

    if (assessmentId) {
      url = `${environment.endpoint.assessments.assessments}/${assessmentId}`;
      httpService = this._http$.put<
        IAssessmentData,
        IResponse<IAssessmentDataServer>
      >(url, data);
    }

    httpService.subscribe({
      next: (response) => {
        this.showSnackBar('Guardado parcialmente', 'success');
        this.formAssessment.update((form) => {
          form.get('assessmentId')?.setValue(response.value.assessmentId);
          form.get('assessmentId')?.setValidators([Validators.required]);

          response.value.domainAssessmentScores.forEach(
            (domainAssessmentScore) => {
              form
                .get(
                  `${domainAssessmentScore.domainKnowledgeId}_domainAssessmentScore`
                )
                ?.setValue(domainAssessmentScore.domainAssessmentScoreId);
              form
                .get(
                  `${domainAssessmentScore.domainKnowledgeId}_domainAssessmentScore`
                )
                ?.setValidators([Validators.required]);
            }
          );

          console.log('response', response);
          return form;
        });
        console.log('form after', this.formAssessment().getRawValue());
      },
      error: (error) => {
        this.showSnackBar('Error al guardar el parcial', 'error');
        console.error(error);
      },
      complete: () => {},
    });
  }

  private saveAndFinish(): void {
    const data = this.createDataForSave();
    data.endDate = new Date().toISOString();
    let url = `${environment.endpoint.assessments.assessments}`;

    this._http$
      .post<IAssessmentData, IResponse<IAssessmentDataServer>>(url, data)
      .subscribe({
        next: (response) => {
          this.showSnackBar('Guardado completamente', 'success');
          console.log('form after', response.value);
          this._router.navigate([
            'assessment-history',
            this.rolePerProfessionalId,
          ]);
        },
        error: (error) => {
          this.showSnackBar('Error al guardar el parcial', 'error');
          console.error(error);
        },
        complete: () => {},
      });
  }

  private createDataForSave(): IAssessmentData {
    // Build base assessment data
    const assessmentData: IAssessmentData = {
      assessmentId: this._getFormValue('assessmentId'),
      userId: this._getFormValue('userId'),
      observations: this._getFormValue('observations'),
      score: Number(this._getFormValue('score')),
      startDate: this._getFormValue('startDate').toISOString(),
      endDate: null,
      rolePerProfessionalId: this._getFormValue('rolePerProfessionalId'),
      configurationLevelId: this._fullConfiguration().configurationLevelId,
      status: Boolean(this.formAssessment().get('status')?.value),
      domainKnowledges: [],
    };

    // Process domain knowledge data
    this._percentageCalculator().forEach((calculator) => {
      calculator.domainKnowledges().forEach((domain, index) => {
        const scoreFieldName = `${domain.domainKnowledgeId}_score`;
        if (this._getIsValidFromField(scoreFieldName)) {
          const score = this._getFormValue(scoreFieldName);

          if (score) {
            const percentage = this._percentageCalculator().get(
              domain.technologyItemId
            );

            if (percentage) {
              const domainData: IDomainKnowledgeData = {
                domainAssessmentScoreId: this._getFormValue(
                  `${domain.domainKnowledgeId}_domainAssessmentScore`
                ),
                domainKnowledgeId: domain.domainKnowledgeId,
                observations: this._getIsValidFromField(
                  `${domain.domainKnowledgeId}_observations`
                )
                  ? this._getFormValue(
                      `${domain.domainKnowledgeId}_observations`
                    )
                  : null,
                score: Number(score),
                rating: percentage.calculatePercentage(Number(score), index),
              };

              assessmentData.domainKnowledges.push(domainData);
            }
          }
        }
      });
    });

    return assessmentData;
  }

  private loadData(): void {
    forkJoin({
      fullConfiguration: this.getFullConfiguration(),
      questionsAndAnswers: this.getQuestionsAndAnswers(),
    }).subscribe({
      next: (results) => {
        this._fullConfiguration.set(results.fullConfiguration);
        this._questionsAndAnswers.set(results.questionsAndAnswers);
        this.updateTitle();
        this.createRadarChart();
        this.updateRadarChartDatasets();
        this.createPercentageCalculator();
        this.createForm();
        this._buttonHeader$.enabledPartialSave = this.formAssessment().invalid;
        this._buttonHeader$.enabledSaveAndFinish = this.formAssessment().valid;
      },
      error: (error) => {
        this.showSnackBar('Error al cargar los datos', 'error');
        console.error(error);
      },
    });
  }

  private createRadarChart(): void {
    const questionsAndAnswers = this._questionsAndAnswers();
    if (questionsAndAnswers.role.technologyPerRoles) {
      this.radarChartLabels.set(
        questionsAndAnswers.role.technologyPerRoles.map((technologyPerRole) => {
          this.radarChartDatasets.update((currentDatasets) => {
            currentDatasets[0].data.push(0);
            return currentDatasets;
          });
          return technologyPerRole.technologyStack.technologyItem.name;
        })
      );
    }
  }

  private updateRadarChartDatasets(): void {
    const fullConfiguration = this._fullConfiguration();
    this.radarChartDatasets.update((currentDatasets) => {
      const existingDataset = currentDatasets[0];
      const newDatasets = fullConfiguration.configurationPerLevels.map(
        (configurationLevel, index) => {
          const data: number[] = this.calculateMaximumValues(
            Number(configurationLevel.level.weight),
            Number(fullConfiguration.ratingScales.at(-1)?.value)
          );
          const [backgroundColor, borderColor] = this.getColorRGB(index);
          this.createScore(data[0], configurationLevel.level.name);
          return {
            data,
            label: configurationLevel.level.name,
            backgroundColor,
            borderColor,
          };
        }
      );
      return [existingDataset, ...newDatasets]; // Combinamos el dataset existente con los nuevos
    });
  }

  private createScore(value: number, name: string): void {
    this._score.update((score) => {
      return score.concat({ value, name });
    });
  }

  private createPercentageCalculator(): void {
    const questionsAndAnswers = this._questionsAndAnswers();
    if (questionsAndAnswers.role.technologyPerRoles) {
      this._percentageCalculator.set(
        new Map(
          Object.entries(
            questionsAndAnswers.role.technologyPerRoles.reduce(
              (acc, technologyPerRole) => ({
                ...acc,
                [technologyPerRole.technologyStack.technologyItem
                  .technologyItemId]: new PercentageCalculator({
                  totalQuestions:
                    technologyPerRole?.technologyStack?.technologyItem
                      ?.domainKnowledges?.length ?? 0,
                  domainKnowledges:
                    technologyPerRole?.technologyStack?.technologyItem
                      ?.domainKnowledges ?? [],
                }),
              }),
              {} as Record<string, PercentageCalculator>
            )
          )
        )
      );
      // console.log('percentageCalculator', this._percentageCalculator());
    }
  }

  private createForm(): void {
    this.formAssessment.update((form) => {
      const assessment = this._questionsAndAnswers()?.assessments;

      const assessmentId = assessment?.at(0)?.assessmentId ?? null;
      form.addControl('assessmentId', new FormControl(assessmentId));

      const rolePerProfessionalId =
        assessment?.at(0)?.rolePerProfessionalId ?? this.rolePerProfessionalId;
      form.addControl(
        'rolePerProfessionalId',
        new FormControl(rolePerProfessionalId, {
          nonNullable: true,
          validators: [Validators.required],
        })
      );

      const userId = assessment?.at(0)?.userId ?? '123';
      form.addControl(
        'userId',
        new FormControl(userId, {
          nonNullable: true,
          validators: [Validators.required],
        })
      );

      const observations = assessment?.at(0)?.observations ?? null;
      form.addControl('observations', new FormControl(observations));

      const score = assessment?.at(0)?.score ?? '0.00';
      form.addControl(
        'score',
        new FormControl(score, {
          nonNullable: true,
          validators: [Validators.required],
        })
      );

      const startDate = new Date(assessment?.at(0)?.startDate ?? Date.now());
      form.addControl(
        'startDate',
        new FormControl(startDate, {
          nonNullable: true,
          validators: [Validators.required],
        })
      );

      const endDate = new Date(assessment?.at(0)?.endDate ?? Date.now());
      form.addControl('endDate', new FormControl(endDate));

      const status = assessment?.at(0)?.status ?? true;
      form.addControl('status', new FormControl(status));

      this._questionsAndAnswers().role.technologyPerRoles?.forEach(
        (technologyPerRole, indexTechnologyPerRole) => {
          technologyPerRole.technologyStack.technologyItem.domainKnowledges.forEach(
            (domainKnowledge, indexDomainKnowledge) => {
              const domainKnowledgeId = domainKnowledge.domainKnowledgeId;
              form.addControl(
                `${domainKnowledge.domainKnowledgeId}_domainAssessmentScore`,
                new FormControl(domainKnowledgeId)
              );

              const domainKnowledgeScore =
                this._questionsAndAnswers()
                  .assessments?.map((assessment) => {
                    return assessment.domainAssessmentScores.find(
                      (domainAssessmentScore) => {
                        return (
                          domainAssessmentScore.domainKnowledgeId ===
                          domainKnowledgeId
                        );
                      }
                    );
                  })
                  .at(0)?.score ?? null;
              form.addControl(
                `${domainKnowledge.domainKnowledgeId}_score`,
                new FormControl(domainKnowledgeScore, {
                  nonNullable: true,
                  validators: [Validators.required],
                })
              );

              const domainKnowledgeObservations =
                this._questionsAndAnswers()
                  .assessments?.map((assessment) => {
                    return assessment.domainAssessmentScores.find(
                      (domainAssessmentScore) => {
                        return (
                          domainAssessmentScore.domainKnowledgeId ===
                          domainKnowledgeId
                        );
                      }
                    );
                  })
                  .at(0)?.observations ?? null;
              form.addControl(
                `${domainKnowledge.domainKnowledgeId}_observations`,
                new FormControl(domainKnowledgeObservations, {
                  validators: [Validators.maxLength(8192)],
                })
              );
            }
          );
        }
      );
      return form;
    });

    if (this._questionsAndAnswers().assessments?.at(0)?.endDate) {
      this._formAssessmentSubscription =
        this.formAssessment().statusChanges.subscribe({
          next: (value) => {
            this._buttonHeader$.enabledPartialSave = false;
            this._buttonHeader$.enabledSaveAndFinish = false;
          },
        });
      return;
    }

    this._formAssessmentSubscription =
      this.formAssessment().statusChanges.subscribe({
        next: (value) => {
          this._buttonHeader$.enabledPartialSave =
            this.formAssessment().invalid;
          this._buttonHeader$.enabledSaveAndFinish =
            this.formAssessment().valid;
        },
      });
  }

  private updateTitle(): void {
    setTimeout(() => {
      this._header$.title = `Evaluación de ${
        this._questionsAndAnswers().professional.name
      } - ${
        this._questionsAndAnswers().role.name
      } - Nivel ${this.updateGeneralLevel()}`;
    });
  }

  private updateGeneralLevel(): string {
    const technologyItem = new Array<{
      name: string;
      weight: number;
      score: number;
    }>();
    const technologyPerRoles =
      this._questionsAndAnswers().role.technologyPerRoles;
    if (technologyPerRoles) {
      technologyPerRoles.forEach((technologyPerRole) => {
        const positionInToGraph = Array.from(this.radarChartLabels()).indexOf(
          technologyPerRole.technologyStack.technologyItem.name
        );
        technologyItem.push({
          name: technologyPerRole.technologyStack.technologyItem.name,
          weight: Number(technologyPerRole.technologyStack.weight),
          score: Number(
            this.radarChartDatasets().at(0)?.data[positionInToGraph]
          ),
        });
      });
    } else {
      console.error('No se pudo obtener la lista de tecnologías');
    }
    this._generalLevel.set(this.calculatePercentage(technologyItem));
    this.formAssessment.update((form) => {
      form.get('score')?.setValue(this._generalLevel());
      return form;
    });
    return this.calculateRanking(this._generalLevel());
  }

  private calculatePercentage(
    data: Array<{ name: string; weight: number; score: number }>
  ): number {
    const ceroWeight = 20;
    let countCeroWeight = 0;
    let averageCeroWeight = 0;
    let totalCero = 0;

    const totalWeight = 80;
    let averageTotalWeight = 0;
    let totalScore = 0;

    data.forEach((technology) => {
      if (technology.weight > 0) {
        averageTotalWeight += technology.weight;
      } else {
        countCeroWeight++;
        averageCeroWeight += technology.score;
      }
    });

    totalCero =
      countCeroWeight > 0
        ? ((averageCeroWeight / countCeroWeight) * ceroWeight) / 100
        : 0;

    data.forEach((technology) => {
      const percentage =
        (technology.weight / averageTotalWeight) *
        (countCeroWeight === 0 ? 100 : totalWeight);
      totalScore += (technology.score * percentage) / 100;
    });

    return totalScore + totalCero;
  }

  private calculateMaximumValues(
    weight: number,
    maxScaleValue: number
  ): number[] {
    const value = weight * maxScaleValue;
    const data: number[] = [];
    this.radarChartLabels().forEach(() => {
      data.push(value);
    });
    return data;
  }

  private getFullConfiguration(): Observable<IFullConfiguration> {
    return this._http$
      .get<IResponse<IFullConfiguration>>(
        `${environment.endpoint.assessments.findOne.fullConfiguration}`
      )
      .pipe(map((response) => response.value));
  }

  private getQuestionsAndAnswers(): Observable<IQuestionsAndAnswers> {
    const httpParams = new HttpParams().set(
      'rolePerProfessionalId',
      this.rolePerProfessionalId
    );
    return this._http$
      .get<IResponse<IQuestionsAndAnswers>>(
        `${environment.endpoint.projectsManagement.rolePerProfessional}/get-assessment-by-role-per-professional`,
        httpParams
      )
      .pipe(map((response) => response.value));
  }

  private showSnackBar(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning'
  ): void {
    const config: Partial<IndividualConfig> = {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-bottom-right',
      timeOut: 10000,
    };
    if (type === 'success') {
      this._notification.success(message, this.getRandomMessage(), config);
    } else if (type === 'error') {
      this._notification.error(message, this.getRandomErrorMessage(), config);
    } else if (type === 'info') {
      this._notification.info(message, undefined, { ...config, timeOut: 2000 });
    } else if (type === 'warning') {
      this._notification.warning(message, undefined, config);
    }
  }

  private getRandomMessage(): string {
    return this.successMessages[
      Math.floor(Math.random() * this.successMessages.length)
    ];
  }

  private getRandomErrorMessage(): string {
    return this.errorMessages[
      Math.floor(Math.random() * this.errorMessages.length)
    ];
  }

  private getColorRGB(index: number): string[] {
    return index < this.colorPalette.length
      ? this.colorPalette[index]
      : [this.getRandomColorRGB(0.1), this.getRandomColorRGB(0.5)];
  }

  private getRandomColorRGB(transparency: number): string {
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, ${transparency})`;
  }

  private calculateRanking(value: number): string {
    return (
      this._score().find((score) => Number(value.toFixed(2)) <= score.value)
        ?.name ?? '"Sin calificación"'
    );
  }
}
