import {Observable} from 'rxjs';

import {IHasID} from 'dfts-helper';
import {HasCreate, HasUpdate} from 'dfx-helper';

import {BackendType} from '@shared/api';

export type HasCreateWithIdResponse<CreateDTOType> = HasCreate<CreateDTOType, BackendType['IdResponse']>;

export type HasUpdateWithIdResponse<UpdateDTOType extends IHasID<UpdateDTOType['id']>> = HasUpdate<
  UpdateDTOType,
  BackendType['IdResponse']
>;

export interface HasOrdered<T extends IHasID<T['id']>> {
  order$(dto: {entityId: T['id']; order: number}[]): Observable<BackendType['IdResponse'][]>;
}
