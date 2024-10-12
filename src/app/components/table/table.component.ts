import {
  Component,
  computed,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { PaginatorSpanishIntl } from '../../services/paginator-spanish-intl.service';
import { customClassTooltip, tooltipsProps } from '../template/tooltips.props';
import { IAction } from './action.interface';
import { IDisplayedColumn } from './displayed-columns.interface';
import { Paginator } from './paginator.class';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatTableModule,
    NgxTippyModule,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: PaginatorSpanishIntl,
    },
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  @Input() columns: Signal<IDisplayedColumn[]>;
  @Input() dataSource: WritableSignal<Object[]>;
  @Input() paginator: WritableSignal<Paginator>;
  @Output() pageEvent: EventEmitter<PageEvent>;

  displayedColumns: Signal<string[]>;
  tooltipsProps = tooltipsProps;
  customClassTooltip = customClassTooltip;

  constructor() {
    this.columns = signal([]);
    this.dataSource = signal([{}]);
    this.displayedColumns = signal([]);
    this.paginator = signal(new Paginator());
    this.pageEvent = new EventEmitter<PageEvent>();
  }

  ngOnInit(): void {
    this.displayedColumns = computed(() =>
      this.columns().map((column: IDisplayedColumn) => column.name)
    );
  }

  isActionColumn(element: any, index: number): boolean {
    const actions = element[this.columns()[index].field];
    if (Array.isArray(actions)) {
      return actions.length > 0;
    }
    return false;
  }

  getElementColumn(element: any, index: number): string | null {
    if (this.columns()[index].field.includes('.')) {
      const fields = this.columns()[index].field.split('.');
      for (const field of fields) {
        element = element[field];
      }
      return element.length > 100 ? element.slice(0, 50) + '...' : element;
    }
    const value = element[this.columns()[index].field];
    if (value) {
      return value.length > 100 ? value.slice(0, 50) + '...' : value;
    }
    return null;
  }

  getTextForTooltip(element: any, index: number): string | null {
    const value = this.getElementColumn(element, index);
    if (value?.endsWith('...')) {
      return element[this.columns()[index].field];
    }
    return null; 
  }

  getArrayActions(element: any, index: number): IAction[] {
    return element[this.columns()[index].field];
  }

  handlePageEvent(event: PageEvent) {
    this.pageEvent.emit(event);
  }

  handleAction(event: Event, action: IAction) {
    event.stopPropagation();
    action.action();
  }

  handleStatusChange(actions: IAction[]): void {
    const action = actions.find(
      (action) =>
        action.tooltip.toLowerCase() === 'estado' ||
        action.tooltip.toLowerCase() === 'status'
    );
    action?.action();
  }
}
