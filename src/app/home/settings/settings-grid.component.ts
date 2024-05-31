import {ChangeDetectionStrategy, Component, computed, effect, inject} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {s_toCurrencyNumber} from '@home-shared/regex';

import {MyUserService} from '@home-shared/services/user/my-user.service';

import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

import {BiComponent} from 'dfx-bootstrap-icons';

import {combineLatest, debounceTime, distinctUntilChanged, map, Observable, OperatorFunction} from 'rxjs';
import {OrganisationsSettingsService} from '../organisations/_services/organisations-settings.service';
import {SelectedOrganisationService} from '../organisations/_services/selected-organisation.service';

@Component({
  template: `
    @if (timeZoneValidChanges()) {}
    @switch (organisationSettingsState.state()) {
      @default {
        <app-progress-bar [show]="organisationSettingsState.state() === 'SETTING'" />

        <div class="row row-cols-1 row-cols-md-2 g-4">
          <div class="col">
            <div class="h-100 p-4 p-lg-5 bg-body-tertiary border rounded-3">
              <h2 class="mb-3">Sicherheit</h2>
              <p>Halte deine Organisation und Veranstaltungen sicher.</p>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="activateWaiterOnSignInViaCreateToken"
                  [checked]="organisationSettingsState().settings!.activateWaiterOnLoginViaCreateToken"
                  (change)="setActivateWaiterOnLoginViaCreateToken($event)"
                />
                <label class="form-check-label" for="activateWaiterOnSignInViaCreateToken">
                  {{ 'HOME_ORGS_SETTINGS_ACTIVATE_WAITER_ON_SIGN_IN_VIA_CREATE_TOKEN' | transloco }}</label
                >
              </div>
            </div>
          </div>

          @if (myUser()?.isAdmin || organisationSettingsState().settings!.stripeEnabled) {
            <div class="col">
              <div class="h-100 p-4 p-lg-5 bg-body-tertiary border rounded-3">
                <div class="d-flex justify-content-between">
                  <h2 class="mb-3">Stripe</h2>
                  @if (myUser()?.isAdmin) {
                    <div class="form-check form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="stripeEnabled"
                        [checked]="organisationSettingsState().settings!.stripeEnabled"
                        (change)="setStripeEnabled($event)"
                      />
                      <label class="form-check-label text-danger" for="stripeEnabled"> {{ 'Stripe aktivieren (admin)' | transloco }}</label>
                    </div>
                  }
                </div>
                <div class="form-group">
                  <label for="stripeMinAmount">{{ 'Mindestbestellwert für Stripe' | transloco }}</label>
                  <div class="input-group">
                    <span class="input-group-text" id="stripeMinAmount-addon"><bi name="currency-euro" /></span>
                    <input
                      type="text"
                      id="stripeMinAmount"
                      class="form-control"
                      placeholder="10.00"
                      [formControl]="stripeMinAmountFormControl"
                    />
                    <button class="btn btn-success" type="button" [disabled]="stripeMinAmountDisabled()" (click)="setStripeMinAmount()">
                      {{ 'SAVE' | transloco }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
          <div class="col">
            <div class="h-100 p-4 p-lg-5 bg-body-tertiary border rounded-3">
              <label for="timezone" class="mb-3"
                ><h2>{{ 'HOME_ORGS_SETTINGS_TIMEZONE' | transloco }}</h2></label
              >

              <div class="form-group">
                <div class="input-group">
                  <span class="input-group-text" id="timezone-addon"><bi name="clock" /></span>
                  <input
                    type="text"
                    id="timezone"
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
                    [disabled]="
                      timeZoneFormControl.errors?.invalidTimeZone ||
                      timeZoneFormControl.getRawValue() === organisationSettingsState().settings!.timezone
                    "
                    (click)="setTimeZone()"
                  >
                    {{ 'SAVE' | transloco }}
                  </button>
                </div>
                <div>
                  @if (
                    timeZoneFormControl.getRawValue() !== organisationSettingsState().settings!.timezone &&
                    !timeZoneFormControl.errors?.invalidTimeZone
                  ) {
                    <small class="text-warning">
                      {{ 'UNSAVED_DATA' | transloco }}
                    </small>
                  }
                </div>
                <div>
                  @if (timeZoneFormControl.errors?.invalidTimeZone) {
                    <small class="text-danger">
                      {{ 'HOME_ORGS_SETTINGS_TIMEZONE_INVALID' | transloco }}
                    </small>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      @case ('LOADING') {
        <app-progress-bar show />
      }
    }
  `,
  selector: 'app-settings-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, BiComponent, TranslocoPipe, NgbTypeahead, AppProgressBarComponent],
})
export class SettingsGridComponent {
  organisationId = inject(SelectedOrganisationService).selectedId;

  organisationSettingsState = inject(OrganisationsSettingsService).state;
  myUser = inject(MyUserService).user;

  availableTimezones$ = toObservable(this.organisationSettingsState.settings).pipe(map((it) => it?.availableTimezones));

  constructor() {
    effect(
      () => {
        const organisationId = this.organisationId();
        if (organisationId) {
          void this.organisationSettingsState.load(organisationId);
        }
      },
      {allowSignalWrites: true},
    );

    effect(
      () => {
        const settings = this.organisationSettingsState.settings();
        if (settings) {
          this.timeZoneFormControl.setValue(settings.timezone);

          this.timeZoneFormControl.addValidators([Validators.required, this.isValidTimeZoneValidator(settings.availableTimezones)]);

          this.stripeMinAmountFormControl.setValue((settings.stripeMinAmount / 100).toString());
        }
      },
      {allowSignalWrites: true},
    );
  }

  timeZoneFormControl = new FormControl<string>('');
  timeZoneValidChanges = toSignal(this.timeZoneFormControl.statusChanges);

  stripeMinAmountFormControl = new FormControl<string>('');
  stripeMinAmountValueChanges = toSignal(this.stripeMinAmountFormControl.valueChanges);
  stripeMinAmountDisabled = computed(() => {
    const value = this.stripeMinAmountValueChanges();

    return value ? s_toCurrencyNumber(value) === this.organisationSettingsState.settings()!.stripeMinAmount : false;
  });

  setTimeZone(): void {
    void this.organisationSettingsState.setTimeZone(this.timeZoneFormControl.value!);
  }

  setActivateWaiterOnLoginViaCreateToken(event: Event): void {
    void this.organisationSettingsState.setActivateWaiterOnLoginViaCreateToken((event.target as HTMLInputElement).checked);
  }

  setStripeEnabled(event: Event): void {
    void this.organisationSettingsState.setStripeEnabled((event.target as HTMLInputElement).checked);
  }

  setStripeMinAmount(): void {
    void this.organisationSettingsState.setStripeMinAmount(s_toCurrencyNumber(this.stripeMinAmountFormControl.value));
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    combineLatest([this.availableTimezones$, text$]).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(([availableTimezones, term]) =>
        term.length < 2 ? [] : availableTimezones?.filter((v) => v.toLowerCase().includes(term.toLowerCase())).slice(0, 10) ?? [],
      ),
    );

  isValidTimeZoneValidator(timezones: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return timezones.includes(control.value as string) ? null : {invalidTimeZone: true};
    };
  }
}
