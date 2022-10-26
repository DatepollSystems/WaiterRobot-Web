import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {PrinterModel} from '../_models/printer.model';
import {GetPrinterResponse} from '../../../_shared/waiterrobot-backend';

import {AbstractModelService} from '../../../_shared/services/abstract-model.service';
import {EventsService} from '../../events/_services/events.service';

@Injectable()
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
