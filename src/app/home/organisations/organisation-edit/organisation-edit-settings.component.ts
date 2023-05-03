import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AComponent} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {combineLatest, map, shareReplay, switchMap} from 'rxjs';
import {getActivatedRouteIdParam} from '../../../_shared/services/getActivatedRouteIdParam';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {OrganisationsSettingsService} from '../_services/organisations-settings.service';

@Component({
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="activateWaiterOnSignInViaCreateToken"
          [checked]="vm.settings.activateWaiterOnLoginViaCreateToken"
          (change)="setActivateWaiterOnLoginViaCreateToken(vm.organisationId, $event)"
        />
        <label class="form-check-label" for="activateWaiterOnSignInViaCreateToken">
          {{ 'HOME_ORGS_SETTINGS_ACTIVATE_WAITER_ON_SIGN_IN_VIA_CREATE_TOKEN' | tr }}</label
        >
      </div>
    </ng-container>
  `,
  selector: 'app-organisation-edit-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AppIconsModule, DfxTr, AsyncPipe, NgIf],
})
export class OrganisationEditSettingsComponent extends AComponent {
  organisationSettingsService$ = inject(OrganisationsSettingsService);

  organisationId$ = getActivatedRouteIdParam().pipe(shareReplay(1));

  vm$ = combineLatest([
    this.organisationId$,
    this.organisationId$.pipe(switchMap((id) => this.organisationSettingsService$.getSettings$(id))),
  ]).pipe(map(([organisationId, settings]) => ({organisationId, settings})));

  setActivateWaiterOnLoginViaCreateToken(organisationId: number, event: Event): void {
    this.organisationSettingsService$.setActivateWaiterOnLoginViaCreateToken(organisationId, (<HTMLInputElement>event.target).checked);
  }
}
