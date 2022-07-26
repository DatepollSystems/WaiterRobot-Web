import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {PrinterModel} from '../../_models/printer.model';
import {GetPrinterResponse} from '../../_models/waiterrobot-backend';

import {AbstractModelService} from './abstract-model.service';

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
