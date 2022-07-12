import {AEntityWithNumberIDAndName} from 'dfx-helper';
import {GetPrinterResponse} from './waiterrobot-backend';

export class PrinterModel extends AEntityWithNumberIDAndName {
  public readonly eventId: number;
  public readonly mediatorId: number;
  public readonly mediatorName: string;
  public readonly productGroups: number[];

  constructor(data: GetPrinterResponse) {
    super(data.id, data.name, data);
    this.eventId = data.eventId;
    this.mediatorId = data.mediatorId;
    this.mediatorName = data.mediatorName;
    this.productGroups = data.productGroups;
  }
}
