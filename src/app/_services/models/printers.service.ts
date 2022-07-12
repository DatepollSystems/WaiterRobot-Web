import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AbstractModelService} from './abstract-model.service';
import {GetPrinterResponse} from '../../_models/waiterrobot-backend';
import {PrinterModel} from '../../_models/printer.model';

@Injectable({
  providedIn: 'root',
})
export class PrintersService extends AbstractModelService<PrinterModel> {
  url = '/config/printer';

  constructor(httpService: HttpClient) {
    super(httpService);
  }

  protected convert(data: any): PrinterModel {
    return new PrinterModel(data as GetPrinterResponse);
  }
}
