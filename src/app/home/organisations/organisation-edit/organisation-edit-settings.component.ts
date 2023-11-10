import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

import {combineLatest, debounceTime, distinctUntilChanged, map, Observable, OperatorFunction, shareReplay, switchMap, tap} from 'rxjs';

import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {getActivatedRouteIdParam} from '../../../_shared/services/getActivatedRouteIdParam';
import {OrganisationsSettingsService} from '../_services/organisations-settings.service';

@Component({
  template: `
    <ng-container *ngIf="timeZoneValidChanges$ | async" />
    <div class="d-flex flex-column gap-4 mt-2" *ngIf="vm$ | async as vm">
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

      <div class="form-group col-12 col-md-10 col-lg-8 col-xl-6">
        <label for="name">{{ 'HOME_ORGS_SETTINGS_TIMEZONE' | tr }}</label>
        <div class="input-group">
          <span class="input-group-text" id="timezone-addon">&#64;</span>
          <input
            type="text"
            class="form-control"
            placeholder="Europe/Vienna"
            aria-label="TimeZone"
            aria-describedby="timezone-addon"
            [formControl]="timeZoneFormControl"
            [ngbTypeahead]="search"
          />
          <button
            class="btn btn-success"
            type="button"
            [disabled]="timeZoneFormControl.errors?.invalidTimeZone || timeZoneFormControl.getRawValue() === vm.settings.timezone"
            (click)="setTimeZone(vm.organisationId, timeZoneFormControl.getRawValue()!)"
          >
            {{ 'SAVE' | tr }}
          </button>
        </div>
        <div>
          <small
            *ngIf="timeZoneFormControl.getRawValue() !== vm.settings.timezone && !timeZoneFormControl.errors?.invalidTimeZone"
            class="text-warning"
          >
            {{ 'UNSAVED_DATA' | tr }}
          </small>
        </div>
        <div>
          <small *ngIf="timeZoneFormControl.errors?.invalidTimeZone" class="text-danger">
            {{ 'HOME_ORGS_SETTINGS_TIMEZONE_INVALID' | tr }}
          </small>
        </div>
      </div>
    </div>
  `,
  selector: 'app-organisation-edit-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, BiComponent, DfxTr, AsyncPipe, NgIf, NgForOf, NgbTypeahead],
})
export class OrganisationEditSettingsComponent {
  organisationSettingsService$ = inject(OrganisationsSettingsService);

  organisationId$ = getActivatedRouteIdParam().pipe(shareReplay(1));
  settings$ = this.organisationId$.pipe(
    switchMap((id) => this.organisationSettingsService$.getSettings$(id)),
    shareReplay(1),
  );

  timeZoneFormControl = new FormControl<string>('');
  timeZoneValidChanges$ = this.timeZoneFormControl.statusChanges;

  vm$ = combineLatest([this.organisationId$, this.settings$]).pipe(
    map(([organisationId, settings]) => ({organisationId, settings})),
    tap((it) => {
      this.timeZoneFormControl.setValue(it.settings.timezone);

      this.timeZoneFormControl.addValidators([Validators.required, this.isValidTimeZoneValidator(it.settings.availableTimezones)]);
    }),
  );

  setActivateWaiterOnLoginViaCreateToken(organisationId: number, event: Event): void {
    this.organisationSettingsService$.setActivateWaiterOnLoginViaCreateToken(organisationId, (<HTMLInputElement>event.target).checked);
  }

  setTimeZone(organisationId: number, it: string): void {
    this.organisationSettingsService$.setTimeZone(organisationId, it);
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    combineLatest([this.settings$, text$]).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(([settings, term]) =>
        term.length < 2 ? [] : settings.availableTimezones.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    );

  isValidTimeZoneValidator(timezones: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return timezones.includes(control.value as string) ? null : {invalidTimeZone: true};
    };
  }
}
