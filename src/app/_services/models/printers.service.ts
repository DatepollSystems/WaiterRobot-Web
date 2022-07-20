import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AbstractModelService} from './abstract-model.service';
import {GetPrinterResponse} from '../../_models/waiterrobot-backend';
import {PrinterModel} from '../../_models/printer.model';
import {EventsService} from './events.service';

@Injectable({
  providedIn: 'root',
})
export class PrintersService extends AbstractModelService<PrinterModel> {
  url = '/config/printer';

  constructor(httpService: HttpClient, eventsService: EventsService) {
    super(httpService);

    this.setGetAllParams([{key: 'eventId', value: eventsService.getSelected()?.id}]);
    eventsService.selectedChange.subscribe((event) => {
      if (event) {
        this.setGetAllParams([{key: 'eventId', value: event.id}]);
        this.getAll();
      }
    });
  }

  protected convert(data: any): PrinterModel {
    return new PrinterModel(data as GetPrinterResponse);
  }
}
