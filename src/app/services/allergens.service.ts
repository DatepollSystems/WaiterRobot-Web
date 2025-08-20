import {Injectable} from '@angular/core';

import {injectAPI} from '../api';

@Injectable({providedIn: 'root'})
export class AllergensService {
  #api = injectAPI();

  getAll$() {
    return this.#api.get('/v1/config/allergen');
  }
}
