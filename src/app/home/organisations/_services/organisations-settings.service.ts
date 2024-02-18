import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {OrganisationSettingResponse} from '@shared/waiterrobot-backend';

import {BehaviorSubject, map, Observable, switchMap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsSettingsService {
  #httpService = inject(HttpClient);

  settingsChange = new BehaviorSubject(true);

  getSettings$(organisationId: number): Observable<OrganisationSettingResponse> {
    return this.settingsChange.pipe(
      switchMap(() =>
        this.#httpService.get<OrganisationSettingResponse>('/config/organisation/settings', {
          params: {organisationId},
        }),
      ),
      map((it) => {
        it.availableTimezones = it.availableTimezones.sort((a, b) => a.trim().toLowerCase().localeCompare(b.trim().toLowerCase()));
        return it;
      }),
    );
  }

  private set(organisationId: number, key: string, value: boolean | number | string): void {
    this.#httpService.put(`/config/organisation/${organisationId}/setting/${key}`, {value}).subscribe({
      next: () => {
        this.settingsChange.next(true);
      },
    });
  }

  public setActivateWaiterOnLoginViaCreateToken(organisationId: number, value: boolean): void {
    this.set(organisationId, 'activateWaiterOnLoginViaCreateToken', value);
  }

  public setTimeZone(organisationId: number, value: string): void {
    this.set(organisationId, 'timezone', value);
  }
}
