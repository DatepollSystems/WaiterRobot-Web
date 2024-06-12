import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import {AppBackButtonComponent} from '@home-shared/components/button/app-back-button.component';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {AbstractModelEditFormComponent} from '@home-shared/form/abstract-model-edit-form.component';
import {AppModelEditSaveBtn} from '@home-shared/form/app-model-edit-save-btn.component';

import {NgSelectModule} from '@ng-select/ng-select';

import {TranslocoPipe} from '@jsverse/transloco';
import {injectIsValid} from '@shared/form';
import {CreateUserDto, GetOrganisationResponse, GetUserResponse, IdAndNameResponse, UpdateUserDto} from '@shared/waiterrobot-backend';

@Component({
  template: `
    @if (isValid()) {}

    <form #formRef class="d-flex flex-column gap-3" [formGroup]="form" (ngSubmit)="submit()">
      <div class="row gy-2">
        <div class="form-group col-sm">
          <label for="email">{{ 'EMAIL' | transloco }}</label>
          <input class="form-control" type="email" id="email" formControlName="emailAddress" [placeholder]="'EMAIL' | transloco" />

          @if (form.controls.emailAddress.invalid) {
            <small class="text-danger">
              {{ 'HOME_USERS_EMAIL_INCORRECT' | transloco }}
            </small>
          }
        </div>

        <div class="form-group col-sm">
          <label for="firstname">{{ 'FIRSTNAME' | transloco }}</label>
          <input class="form-control" type="text" id="firstname" formControlName="firstname" [placeholder]="'FIRSTNAME' | transloco" />

          @if (form.controls.firstname.invalid) {
            <small class="text-danger">
              {{ 'HOME_USERS_NAME_INCORRECT' | transloco }}
            </small>
          }
        </div>

        <div class="form-group col-sm">
          <label for="surname">{{ 'SURNAME' | transloco }}</label>
          <input class="form-control" type="text" id="surname" formControlName="surname" [placeholder]="'SURNAME' | transloco" />
          @if (form.controls.surname.invalid) {
            <small class="text-danger">
              {{ 'HOME_USERS_SUR_NAME_INCORRECT' | transloco }}
            </small>
          }
        </div>
      </div>

      <div class="row gy-2">
        <div class="col col-md-6">
          <div class="form-group mb-2">
            <label for="password">{{ 'PASSWORD' | transloco }}</label>
            <input class="form-control" type="password" id="password" formControlName="password" placeholder="*******" />

            @if (form.controls.password.invalid) {
              <small class="text-danger">
                {{ 'HOME_USERS_PASSWORD_INCORRECT' | transloco }}
              </small>
            }
          </div>

          @if (!isCreating()) {
            <div class="form-check form-switch mt-2">
              <input class="form-check-input" type="checkbox" role="switch" id="updatePassword" formControlName="updatePassword" />
              <label class="form-check-label" for="updatePassword">{{ 'HOME_USERSETTINGS_USER_SETTINGS_PASSWORD' | transloco }}</label>
            </div>
          }
        </div>

        @if (!isCreating()) {
          <div class="form-group col">
            <label for="orgSelect">{{ 'NAV_ORGANISATIONS' | transloco }}</label>
            <ng-select
              bindLabel="name"
              bindValue="id"
              labelForId="orgSelect"
              clearAllText="Clear"
              formControlName="selectedOrganisations"
              [items]="organisations"
              [multiple]="true"
              [placeholder]="'HOME_USERS_ORGS_INPUT_PLACEHOLDER' | transloco"
              (change)="userOrganisations.emit($event)"
            />
          </div>
        }
      </div>

      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="sendInvitation" formControlName="sendInvitation" />
        <label class="form-check-label" for="sendInvitation">
          {{ 'HOME_USERS_SEND_INVITE' | transloco }}
        </label>
      </div>

      <div class="d-flex flex-column flex-md-row gap-2 gap-md-4">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="isAdmin" formControlName="isAdmin" />
          <label class="form-check-label" for="isAdmin">
            {{ 'HOME_USERS_ADMIN' | transloco }}
          </label>
        </div>

        @if (!isCreating()) {
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="activated" formControlName="activated" />
            <label class="form-check-label" for="activated">
              {{ 'HOME_USERS_ACTIVATED' | transloco }}
            </label>
          </div>
        }

        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="forcePasswordChange" formControlName="forcePasswordChange" />
          <label class="form-check-label" for="forcePasswordChange">
            {{ 'HOME_USERS_FORCE_PASSWORD_CHANGE' | transloco }}
          </label>
        </div>
      </div>

      <app-model-edit-save-btn [valid]="isValid()" [creating]="isCreating()" />
    </form>
  `,
  selector: 'app-user-edit-form',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    AppBackButtonComponent,
    ScrollableToolbarComponent,
    AppModelEditSaveBtn,
    NgSelectModule,
    FormsModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditFormComponent extends AbstractModelEditFormComponent<CreateUserDto, UpdateUserDto> {
  @Output() readonly userOrganisations = new EventEmitter<[]>();

  form = inject(FormBuilder).nonNullable.group({
    emailAddress: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255), Validators.email]],
    firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
    surname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(35)]],
    password: ['', [Validators.minLength(6)]],
    updatePassword: [false],
    isAdmin: [false, [Validators.required]],
    activated: [true, [Validators.required]],
    sendInvitation: [false, [Validators.required]],
    forcePasswordChange: [false, [Validators.required]],
    selectedOrganisations: [new Array<number>()],
    id: [-1],
  });

  isValid = injectIsValid(this.form);

  override overrideRawValue = (value: typeof this.form.value): unknown => {
    // @ts-expect-error role does not exist
    value.role = value.isAdmin ? 'ADMIN' : 'USER';
    if ((value.updatePassword === false || value.updatePassword === undefined) && !this.isCreating()) {
      value.password = undefined;
    }

    return super.overrideRawValue(value);
  };

  override reset(): void {
    super.reset();

    this.form.controls.password.enable();
  }

  lastForcePasswordChangeValue?: boolean;
  lastActivatedValue?: boolean;

  constructor() {
    super();

    this.form.controls.updatePassword.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      if (value) {
        this.form.controls.password.enable();
      } else {
        this.form.controls.password.disable();
      }
    });

    this.form.controls.sendInvitation.valueChanges.pipe(takeUntilDestroyed()).subscribe((it) => {
      if (it) {
        this.lastForcePasswordChangeValue = this.form.controls.forcePasswordChange.getRawValue();
        this.form.controls.forcePasswordChange.disable();
        this.form.controls.forcePasswordChange.setValue(true);
        this.lastActivatedValue = this.form.controls.activated.getRawValue();
        this.form.controls.activated.disable();
        this.form.controls.activated.setValue(true);
        return;
      }

      this.form.controls.forcePasswordChange.setValue(this.lastForcePasswordChangeValue!);
      this.form.controls.forcePasswordChange.enable();
      this.form.controls.activated.setValue(this.lastActivatedValue!);
      this.form.controls.activated.enable();
    });
  }

  @Input()
  set user(it: GetUserResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isCreating.set(true);
      this.form.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
      return;
    }

    this.form.controls.password.disable();
    this.form.patchValue({
      id: it.id,
      emailAddress: it.emailAddress,
      firstname: it.firstname,
      surname: it.surname,
      isAdmin: it.role === 'ADMIN',
      activated: it.activated,
      forcePasswordChange: it.forcePasswordChange,
    });
  }

  @Input() organisations: GetOrganisationResponse[] = [];
  @Input() set selectedOrganisations(selectedOrganisations: IdAndNameResponse[]) {
    this.form.controls.selectedOrganisations.setValue(selectedOrganisations.map((it) => it.id));
  }
}
