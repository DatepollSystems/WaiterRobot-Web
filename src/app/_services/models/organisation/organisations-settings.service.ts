import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';

import {OrganisationSettingsModel} from '../../../_models/organisation/organisation-settings.model';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsSettingsService {
  private _settings: OrganisationSettingsModel | undefined;
  public settingsChange: Subject<OrganisationSettingsModel> = new Subject<OrganisationSettingsModel>();

  constructor(private httpService: HttpClient) {}

  public getSettings(organisationId: number): OrganisationSettingsModel | undefined {
    this.fetchSettings(organisationId);
    return this._settings;
  }

  private setSettings(settings: OrganisationSettingsModel): void {
    this._settings = settings;
    this.settingsChange.next(this._settings);
  }

  private fetchSettings(organisationId: number): void {
    this.httpService
      .get('/config/organisation/settings', {params: new HttpParams().set('organisationId', organisationId)})
      .subscribe((data: unknown) => {
        this.setSettings(new OrganisationSettingsModel(data));
      });
  }

  private set(organisationId: number, key: string, value: boolean | number | string): void {
    const dto = {
      value: value,
    };
    this.httpService.put(`/config/organisation/${organisationId}/setting/${key}`, dto).subscribe({
      next: () => {
        this.fetchSettings(organisationId);
      },
    });
  }

  public setActivateWaiterOnSignInViaCreateToken(organisationId: number, value: boolean): void {
    this.set(organisationId, 'activateWaiterOnSignInViaCreateToken', value);
  }
}
