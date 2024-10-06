import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class PaginatorSpanishIntl implements MatPaginatorIntl {
  changes = new Subject<void>();
  firstPageLabel = $localize`Primera página`;
  itemsPerPageLabel = $localize`Registros por página`;
  lastPageLabel = $localize`Última página`;
  nextPageLabel = 'Siguiente página';
  previousPageLabel = 'Página anterior';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Página 1 de 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Página ${page + 1} de ${amountPages}`;
  }
}
