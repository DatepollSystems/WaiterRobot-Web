import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {AbstractModelService} from '../../../_shared/services/abstract-model.service';
import {GetPrinterResponse} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';
import {PrinterModel} from '../_models/printer.model';

@Injectable({
  providedIn: 'root',
})
export class PrintersService extends AbstractModelService<PrinterModel> {
  url = '/config/printer';

  constructor(httpService: HttpClient, private eventsService: EventsService) {
    super(httpService);
    this.setSelectedEventGetAllUrl();
  }

  public setSelectedEventGetAllUrl(): void {
    this.setGetAllParams([{key: 'eventId', value: this.eventsService.getSelected()?.id}]);
  }

  protected convert(data: any): PrinterModel {
    return new PrinterModel(data as GetPrinterResponse);
  }
}
