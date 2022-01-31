import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {EventsService} from './events.service';
import {AbstractModelService} from './abstract-model.service';

import {ProductModel} from '../../_models/product.model';
import {AllergenModel} from '../../_models/allergen.model';

@Injectable({
  providedIn: 'root',
})
export class AllergensService extends AbstractModelService<AllergenModel> {
  constructor(httpService: HttpService) {
    super(httpService, '/config/allergen');
  }

  protected convert(data: any): AllergenModel {
    return new AllergenModel(data);
  }
}
