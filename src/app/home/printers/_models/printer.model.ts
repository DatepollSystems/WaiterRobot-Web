import {AEntityWithNumberIDAndName} from 'dfts-helper';
import {GetPrinterResponse, GetProductMinResponse} from '../../../_shared/waiterrobot-backend';

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
