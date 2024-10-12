import { IEntity } from "../../../components/generic-crud/entity.interface";

export interface ITechnologyType extends IEntity {
  technologyTypeId?: string;
  name: string;
  description?: string;
}
