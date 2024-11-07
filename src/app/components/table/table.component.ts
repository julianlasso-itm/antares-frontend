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
    const field = this.columns()[index].field;
    const value = this.getNestedValue(element, field);
    return this.formatValue(value);
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((value, key) => {
      if (value === null || value === undefined) return null;
      if (key.includes('[')) {
        return this.handleArrayAccess(value, key);
      }
      return value[key];
    }, obj);
  }

  private handleArrayAccess(value: any, key: string): any {
    const parts = key.split(/[\[\]]+/).filter(Boolean);
    return parts.reduce((currentValue, part, index) => {
      if (index % 2 === 0) {
        return currentValue[part];
      } else {
        const arrayIndex = parseInt(part);
        return currentValue[arrayIndex];
      }
    }, value);
  }

  private formatValue(value: any): string | null {
    if (value === null || value === undefined) return null;
    const stringValue = String(value);
    return this.truncateString(stringValue, 40);
  }

  private truncateString(str: string, maxLength: number): string {
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
  }

  // getElementColumn(element: any, index: number): string | null {
  //   const field = this.columns()[index].field;
  //   console.log('field', field);

  //   let value = element;
  //   const fields = field.split('.');

  //   for (const f of fields) {
  //     if (value === null || value === undefined) {
  //       return null;
  //     }

  //     if (f.includes('[')) {
  //       // Handle array access, possibly multiple times
  //       const parts = f.split(/[\[\]]+/).filter(Boolean);
  //       let currentValue = value;
  //       for (let i = 0; i < parts.length; i++) {
  //         if (i % 2 === 0) {
  //           // Even indexes are property names
  //           currentValue = currentValue[parts[i]];
  //         } else {
  //           // Odd indexes are array indices
  //           const arrayIndex = parseInt(parts[i]);
  //           currentValue = currentValue[arrayIndex];
  //         }
  //       }
  //       value = currentValue;
  //     } else {
  //       value = value[f];
  //     }
  //   }

  //   if (typeof value === 'string') {
  //     return value.length > 40 ? value.slice(0, 40) + '...' : value;
  //   } else if (value !== null && value !== undefined) {
  //     const stringValue = String(value);
  //     return stringValue.length > 40
  //       ? stringValue.slice(0, 40) + '...'
  //       : stringValue;
  //   }

  //   return null;
  // }

  getTextForTooltip(element: any, index: number): string | null {
    const value = this.getElementColumn(element, index);
    if (value?.toString().endsWith('...')) {
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
