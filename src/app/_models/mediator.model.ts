import {AEntityWithNumberIDAndName} from 'dfx-helper';
import {GetMediatorResponse} from './waiterrobot-backend';

export class MediatorModel extends AEntityWithNumberIDAndName {
  public readonly address: string;
  public readonly pdfCreator: boolean;
  public readonly organisationId: number;
  public readonly active: boolean;
  public readonly lastContact?: string;
  public readonly printers: number[];

  constructor(data: GetMediatorResponse) {
    super(data.id, data.name, data);
    this.address = data.address;
    this.pdfCreator = data.pdfCreator;
    this.organisationId = data.organisationId;
    this.active = data.active;
    this.lastContact = data.lastContact;
    this.printers = data.printers;
  }
}
