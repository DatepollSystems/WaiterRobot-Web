import {AEntityWithStringID} from 'dfx-helper';
import {DateAsString, GetMediatorResponse, GetPrinterMinResponse} from './waiterrobot-backend';

export class MediatorModel extends AEntityWithStringID {
  public readonly name?: string;
  public readonly organisationId: number;
  public readonly active: boolean;
  public readonly lastContact?: DateAsString;
  public readonly printers: GetPrinterMinResponse[];

  constructor(data: GetMediatorResponse) {
    super(data.id, data);
    this.name = data.name;
    this.organisationId = data.organisationId;
    this.active = data.active;
    this.lastContact = data.lastContact;
    this.printers = data.printers;
  }
}
