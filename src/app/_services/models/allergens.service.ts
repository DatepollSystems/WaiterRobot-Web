import {Injectable} from '@angular/core';

import {HttpService} from '../http.service';
import {AbstractModelService} from './abstract-model.service';
import {AllergenModel} from '../../_models/allergen.model';
import {GetAllergenResponse} from '../../_models/waiterrobot-backend';

@Injectable({
  providedIn: 'root',
})
export class AllergensService extends AbstractModelService<AllergenModel> {
  constructor(httpService: HttpService) {
    super(httpService, '/config/allergen');
  }

  protected convert(data: any): AllergenModel {
    return new AllergenModel(data as GetAllergenResponse);
  }
}
