import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {GetAllergenResponse} from '../../../_shared/waiterrobot-backend';
import {HasGetAll} from '../../../_shared/services/abstract-entity.service';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AllergensService implements HasGetAll<GetAllergenResponse> {
  url = '/config/allergen';

  constructor(private httpClient: HttpClient) {}

  getAll$(): Observable<GetAllergenResponse[]> {
    return this.httpClient.get<GetAllergenResponse[]>(this.url);
  }
}
