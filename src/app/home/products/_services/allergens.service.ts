import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {AllergenModel} from '../_models/allergen.model';

import {GetAllergenResponse} from '../../../_shared/waiterrobot-backend';
import {AbstractModelService} from '../../../_shared/services/abstract-model.service';

@Injectable({providedIn: 'root'})
export class AllergensService extends AbstractModelService<AllergenModel> {
  override url = '/config/allergen';

  constructor(httpService: HttpClient) {
    super(httpService);
  }

  protected convert(data: any): AllergenModel {
    return new AllergenModel(data as GetAllergenResponse);
  }
}
