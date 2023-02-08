import {HasIDAndName} from 'dfts-helper';
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

export const notNull = <T>(value: T | null): value is T => value !== null;
export const notNullAndUndefined = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined;
