import {AEntityWithNumberIDAndName} from 'dfx-helper';
import {GetPrinterResponse, GetProductMinResponse} from './waiterrobot-backend';

export class PrinterModel extends AEntityWithNumberIDAndName {
  public readonly printerName: string;
  public readonly eventId: number;
  public readonly products: GetProductMinResponse[];

  constructor(data: GetPrinterResponse) {
    super(data.id, data.name, data);
    this.printerName = data.printerName;
    this.eventId = data.eventId;
    this.products = data.products;
  }
}
