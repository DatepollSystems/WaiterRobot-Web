import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, effect, inject} from '@angular/core';
import {takeUntilDestroyed, toObservable, toSignal} from '@angular/core/rxjs-interop';
import {AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {s_toCurrencyNumber} from '@home-shared/regex';

import {injectIdParam$} from '@home-shared/services/injectActivatedRouteIdParam';
import {MyUserService} from '@home-shared/services/user/my-user.service';

import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {AppSpinnerRowComponent} from '@shared/ui/loading/app-spinner-row.component';

import {BiComponent} from 'dfx-bootstrap-icons';

import {combineLatest, debounceTime, distinctUntilChanged, map, Observable, OperatorFunction} from 'rxjs';
import {OrganisationsSettingsService} from '../_services/organisations-settings.service';

@Component({
  template: `
    @if (timeZoneValidChanges()) {}
    @switch (organisationSettingsState.state()) {
      @default {
        <app-progress-bar [show]="organisationSettingsState.state() === 'SETTING'" />

        <div class="d-flex flex-column gap-5">
          <div class="d-flex flex-column gap-2">
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

            <div class="form-group col-12 col-md-10 col-lg-8 col-xl-6">
              <label for="timezone">{{ 'HOME_ORGS_SETTINGS_TIMEZONE' | transloco }}</label>
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

            <div class="form-group col-12 col-md-10 col-lg-8 col-xl-6">
              <label for="stripeMinAmount">{{ 'Stripe Min Amount' | transloco }}</label>
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

          @if (myUser()?.isAdmin) {
            <div class="d-flex flex-column gap-4 mt-2">
              <h3 class="my-0">Organisation Admin Settings</h3>

              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="stripeEnabled"
                  [checked]="organisationSettingsState().settings!.stripeEnabled"
                  (change)="setStripeEnabled($event)"
                />
                <label class="form-check-label" for="stripeEnabled"> {{ 'Stripe Enabled' | transloco }}</label>
              </div>
            </div>
          }
        </div>
      }
      @case ('LOADING') {
        <app-spinner-row />
      }
    }
  `,
  selector: 'app-organisation-edit-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, BiComponent, TranslocoPipe, AsyncPipe, NgbTypeahead, AppSpinnerRowComponent, AppProgressBarComponent],
})
export class OrganisationEditSettingsComponent {
  organisationSettingsState = inject(OrganisationsSettingsService).state;
  myUser = inject(MyUserService).user;

  availableTimezones$ = toObservable(this.organisationSettingsState.settings).pipe(map((it) => it?.availableTimezones));

  constructor() {
    injectIdParam$()
      .pipe(takeUntilDestroyed())
      .subscribe((id) => void this.organisationSettingsState.load(id));

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
