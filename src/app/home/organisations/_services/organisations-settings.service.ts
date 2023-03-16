import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import {OrganisationSettingResponse} from '../../../_shared/waiterrobot-backend';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsSettingsService {
  constructor(private httpService: HttpClient) {}

  settingsChange = new BehaviorSubject(true);

  getSettings$(organisationId: number): Observable<OrganisationSettingResponse> {
    return this.settingsChange.pipe(
      switchMap(() =>
        this.httpService.get<OrganisationSettingResponse>('/config/organisation/settings', {
          params: new HttpParams().set('organisationId', organisationId),
        })
      )
    );
  }

  private set(organisationId: number, key: string, value: boolean | number | string): void {
    this.httpService.put(`/config/organisation/${organisationId}/setting/${key}`, {value}).subscribe({
      next: () => {
        this.settingsChange.next(true);
      },
    });
  }

  public setActivateWaiterOnLoginViaCreateToken(organisationId: number, value: boolean): void {
    this.set(organisationId, 'activateWaiterOnLoginViaCreateToken', value);
  }
}
