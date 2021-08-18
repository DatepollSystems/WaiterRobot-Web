import {Injectable} from '@angular/core';
import {AModelService} from 'dfx-helper';

import {ProductsModel} from '../_models/products';
import {HttpService} from './http.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends AModelService<ProductsModel> {

  constructor(httpService: HttpService) {
    super(httpService, '/config/products');
  }

  protected convert(data: any): ProductsModel {
    return new ProductsModel(data);
  }
}
