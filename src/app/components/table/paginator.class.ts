export class Paginator {
  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  showFirstLastButtons: boolean = true;
}
