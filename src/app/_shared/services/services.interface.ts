import {IHasID} from 'dfts-helper';
import {HasCreate, HasUpdate} from 'dfx-helper';
import {IdResponse} from '../waiterrobot-backend';

export type HasCreateWithIdResponse<CreateDTOType> = HasCreate<CreateDTOType, IdResponse>;

export type HasUpdateWithIdResponse<UpdateDTOType extends IHasID<UpdateDTOType['id']>> = HasUpdate<UpdateDTOType, IdResponse>;

export type HasIdAndNumber<ID> = IHasID<ID> & {number: number};
