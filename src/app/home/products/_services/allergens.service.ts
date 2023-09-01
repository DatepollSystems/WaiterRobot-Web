import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

import {HasGetAll} from 'dfx-helper';

import {GetAllergenResponse} from '../../../_shared/waiterrobot-backend';

@Injectable({providedIn: 'root'})
export class AllergensService implements HasGetAll<GetAllergenResponse> {
  url = '/config/allergen';

  constructor(private httpClient: HttpClient) {}

  getAll$(): Observable<GetAllergenResponse[]> {
    return this.httpClient.get<GetAllergenResponse[]>(this.url);
  }
}
