import {IHasID} from 'dfts-helper';
import {Observable} from 'rxjs';
import {IdResponse} from '../waiterrobot-backend';

export interface HasGetAll<T> {
  getAll$(): Observable<T[]>;
}

export interface HasGetByParent<EntityType, ParentType extends IHasID<ParentType['id']>> {
  getByParent$(id: ParentType['id']): Observable<EntityType[]>;
}

export interface HasGetSingle<T extends IHasID<T['id']>> {
  getSingle$(id: T['id']): Observable<T>;
}

export interface HasDelete<T extends IHasID<T['id']>> {
  delete$(id: T['id']): Observable<unknown>;
}

export type HasCreateWithIdResponse<CreateDTOType> = HasCreate<CreateDTOType, IdResponse>;
export type HasUpdateWithIdResponse<UpdateDTOType extends IHasID<UpdateDTOType['id']>> = HasUpdate<UpdateDTOType, IdResponse>;

export type HasCreate<CreateDTOType, ResponseType extends IHasID<ResponseType['id']>> = {
  create$(dto: CreateDTOType): Observable<ResponseType>;
};

export interface HasUpdate<UpdateDTOType extends IHasID<UpdateDTOType['id']>, ResponseType extends IHasID<ResponseType['id']>> {
  update$(dto: UpdateDTOType): Observable<ResponseType>;
}

export type HasIdAndNumber<ID> = IHasID<ID> & {number: number};

export const notNull = <T>(value: T | null): value is T => value !== null;
export const notNullAndUndefined = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined;
