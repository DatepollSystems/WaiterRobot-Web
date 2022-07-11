import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {GetAllergenResponse} from '../../_models/waiterrobot-backend';
import {AbstractModelService} from './abstract-model.service';

import {AllergenModel} from '../../_models/allergen.model';

@Injectable({
  providedIn: 'root',
})
export class AllergensService extends AbstractModelService<AllergenModel> {
  constructor(httpService: HttpClient) {
    super(httpService, '/config/allergen');
  }

  protected convert(data: any): AllergenModel {
    return new AllergenModel(data as GetAllergenResponse);
  }
}
