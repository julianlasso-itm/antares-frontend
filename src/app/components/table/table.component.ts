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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IAction } from './action.interface';
import { IDisplayedColumn } from './displayed-columns.interface';
import { Paginator } from './paginator.class';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
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

  getElementColumn(element: any, index: number): string {
    return element[this.columns()[index].field];
  }

  getArrayActions(element: any, index: number): IAction[] {
    return element[this.columns()[index].field];
  }

  handlePageEvent(event: PageEvent) {
    this.pageEvent.emit(event);
  }

  handleAction(event: Event, element: any, action: IAction) {
    event.stopPropagation();
    action.action(element);
  }
}
