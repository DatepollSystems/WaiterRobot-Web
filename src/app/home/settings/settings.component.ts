import {Component, effect, inject} from '@angular/core';

import {TranslocoPipe} from '@jsverse/transloco';

import {OrganisationsSettingsService} from '../../services/organisations/organisations-settings.service';
import {SelectedOrganisationService} from '../../services/selected-organisation.service';
import {OrganisationUsersSettingsComponent} from './organisation-edit-users/organisation-users-settings.component';
import {SettingsGridComponent} from './settings-grid.component';
import {StripeSettingsComponent} from './stripe/stripe-settings.component';

@Component({
  template: `
    <div class="d-flex flex-column gap-5">
      <div class="d-flex flex-column gap-3">
        <h1 class="my-0">{{ 'SETTINGS' | transloco }}</h1>

        <app-settings-grid />
      </div>

      <app-organisation-edit-users />

      @if (settingsState.settings()?.stripeEnabled) {
        <app-stripe-settings />
      }
    </div>
  `,
  selector: 'app-settings',
  imports: [SettingsGridComponent, StripeSettingsComponent, OrganisationUsersSettingsComponent, TranslocoPipe],
})
export class SettingsComponent {
  settingsState = inject(OrganisationsSettingsService).state;

  constructor() {
    const selectedOrganisationId = inject(SelectedOrganisationService).selectedId;
    effect(() => {
      const organisationId = selectedOrganisationId();
      if (organisationId) {
        void this.settingsState.load(organisationId);
      }
    });
  }
}
