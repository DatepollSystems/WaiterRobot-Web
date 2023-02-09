import {HasIDAndName, IHasID} from 'dfts-helper';
import {Observable} from 'rxjs';

export interface HasGetAll<T> {
  getAll$(): Observable<T[]>;
}

export interface HasGetByParent<EntityType, ParentType extends HasIDAndName<ParentType['id']>> {
  getByParent$(id: ParentType['id']): Observable<EntityType[]>;
}

export interface HasGetSingle<T extends HasIDAndName<T['id']>> {
  getSingle$(id: T['id']): Observable<T>;
}

export interface HasDelete<T extends HasIDAndName<T['id']>> {
  delete$(id: T['id']): Observable<unknown>;
}

export interface HasCreate<CreateDTOType, ResponseType extends IHasID<ResponseType['id']>> {
  create$(dto: CreateDTOType): Observable<ResponseType>;
}

export interface HasUpdate<UpdateDTOType extends IHasID<UpdateDTOType['id']>, ResponseType extends IHasID<ResponseType['id']>> {
  update$(dto: UpdateDTOType): Observable<ResponseType>;
}

export const notNull = <T>(value: T | null): value is T => value !== null;
export const notNullAndUndefined = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined;
