import {Observable} from 'rxjs';

import {IHasID} from 'dfts-helper';
import {HasCreate, HasUpdate} from 'dfx-helper';

import {IdResponse} from '../waiterrobot-backend';

export type HasCreateWithIdResponse<CreateDTOType> = HasCreate<CreateDTOType, IdResponse>;

export type HasUpdateWithIdResponse<UpdateDTOType extends IHasID<UpdateDTOType['id']>> = HasUpdate<UpdateDTOType, IdResponse>;

export type HasIdAndNumber<ID> = IHasID<ID> & {number: number};

export interface HasOrdered<T extends IHasID<T['id']>> {
  order$(dto: {entityId: T['id']; order: number}[]): Observable<IdResponse[]>;
}

export type PaginationResponse<T> = {numberOfItems: number; numberOfPages: number; data: T[]};
