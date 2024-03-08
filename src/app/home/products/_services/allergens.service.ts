import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {GetAllergenResponse} from '@shared/waiterrobot-backend';

import {HasGetAll} from 'dfx-helper';

import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AllergensService implements HasGetAll<GetAllergenResponse> {
  url = '/config/allergen';

  #httpClient = inject(HttpClient);

  getAll$(): Observable<GetAllergenResponse[]> {
    return this.#httpClient.get<GetAllergenResponse[]>(this.url);
  }
}
