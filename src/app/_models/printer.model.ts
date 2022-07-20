import {AEntityWithNumberIDAndName} from 'dfx-helper';
import {GetPrinterResponse, GetProductGroupMinResponse} from './waiterrobot-backend';

export class PrinterModel extends AEntityWithNumberIDAndName {
  public readonly printerName: string;
  public readonly eventId: number;
  public readonly productGroups: GetProductGroupMinResponse[];

  constructor(data: GetPrinterResponse) {
    super(data.id, data.name, data);
    this.printerName = data.printerName;
    this.eventId = data.eventId;
    this.productGroups = data.productGroups;
  }
}
