import {Observable} from 'rxjs';

import {IHasID} from 'dfts-helper';
import {HasCreate, HasUpdate} from 'dfx-helper';

import {APIType} from '../api';

export type HasCreateWithIdResponse<CreateDTOType> = HasCreate<CreateDTOType, APIType['IdResponse']>;

export type HasUpdateWithIdResponse<UpdateDTOType extends IHasID<UpdateDTOType['id']>> = HasUpdate<UpdateDTOType, APIType['IdResponse']>;

export interface HasOrdered<T extends IHasID<T['id']>> {
  order$(dto: {entityId: T['id']; order: number}[]): Observable<APIType['IdResponse'][]>;
}
