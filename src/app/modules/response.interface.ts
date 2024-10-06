export interface IResponse<TData> {
  value: TData;
}

export interface IFindAllResponse<Type> {
  data: Type[];
  total: number;
}
