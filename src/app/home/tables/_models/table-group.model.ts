import {AEntityWithNumberIDAndName} from 'dfts-helper';
import {GetTableGroupResponse} from '../../../_shared/waiterrobot-backend';

export class TableGroupModel extends AEntityWithNumberIDAndName {
  public seats: number;
  public eventId: number;

  constructor(data: GetTableGroupResponse) {
    super(data.id, data.name, data);
    this.seats = 0;
    this.eventId = data.eventId;
  }
}
