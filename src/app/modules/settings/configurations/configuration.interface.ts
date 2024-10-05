export interface IConfiguration {
  id: string;
  name: string;
  status: boolean;
  actions?: IAction[];
}

export interface IAction {
  tooltip: string;
  icon: string;
  action: Function;
}
