import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {PrinterModel} from '../../_models/printer.model';
import {GetPrinterResponse} from '../../_models/waiterrobot-backend';

import {AbstractModelService} from './abstract-model.service';
import {EventsService} from './events.service';

@Injectable({
  providedIn: 'root',
})
export class PrintersService extends AbstractModelService<PrinterModel> {
  url = '/config/printer';

  constructor(httpService: HttpClient, private eventsService: EventsService) {
    super(httpService);
  }

  public setSelectedEventGetAllUrl(): void {
    this.setGetAllParams([{key: 'eventId', value: this.eventsService.getSelected()?.id}]);
  }

  protected convert(data: any): PrinterModel {
    return new PrinterModel(data as GetPrinterResponse);
  }
}
