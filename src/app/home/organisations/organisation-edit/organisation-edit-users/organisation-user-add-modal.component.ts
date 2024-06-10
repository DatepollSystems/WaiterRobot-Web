import {LowerCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule} from '@angular/forms';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslocoPipe} from '@ngneat/transloco';
import {injectIsValid} from '@shared/form';

import {s_isEmail} from 'dfts-helper';
import {OrganisationUsersService} from '../../_services/organisations-users.service';

@Component({
  template: `
    <div class="modal-header">
      <h3 class="modal-title" id="modal-title-org-user-add">{{ 'USER' | transloco }} {{ 'ADD_3' | transloco | lowercase }}</h3>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (mousedown)="activeModal.dismiss()"></button>
    </div>
    @if (formValid()) {}
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="modal-body">
        <div class="form-group col">
          <label for="emailSelect">{{ 'EMAIL' | transloco }}</label>
          <ng-select
            labelForId="emailSelect"
            clearAllText="Clear"
            formControlName="emailAddresses"
            [addTag]="true"
            [multiple]="true"
            [placeholder]="'HOME_ORGS_USERS_EMAIL_PLACEHOLDER' | transloco"
            [notFoundText]="'HOME_ORGS_USERS_EMAIL_PLACEHOLDER' | transloco"
          />
          @if (form.hasError('emailIsInvalid')) {
            <small class="text-danger">
              {{ 'HOME_USERS_EMAIL_INCORRECT' | transloco }}
            </small>
          }
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-success" type="submit" [disabled]="form.invalid">
          {{ 'ADD_3' | transloco }}
        </button>
        <button type="button" class="btn btn-outline-secondary" (mousedown)="activeModal.close()">{{ 'CLOSE' | transloco }}</button>
      </div>
    </form>
  `,
  selector: 'app-organisation-user-add-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, LowerCasePipe, NgSelectModule, ReactiveFormsModule],
})
export class OrganisationUserAddModalComponent {
  activeModal = inject(NgbActiveModal);
  #organisationUsersState = inject(OrganisationUsersService);

  entityId!: number;

  form = inject(FormBuilder).nonNullable.group(
    {
      emailAddresses: [new Array<{label: string}>()],
    },
    {validators: this.emailArrayValidator},
  );

  formValid = injectIsValid(this.form);

  emailArrayValidator(control: AbstractControl): Record<string, boolean> | null {
    const emails = (control.get('emailAddresses')?.value as {label: string}[] | undefined) ?? [];

    console.log('emails', emails);
    const emailsAllValid =
      emails.length < 1
        ? false
        : emails.every((item) => {
            return s_isEmail(item.label);
          });
    if (emailsAllValid) {
      console.log('addresses valid');
      return null;
    }
    console.log('addresses invalid');
    return {emailIsInvalid: true};
  }

  submit(): void {
    const emails = this.form.controls.emailAddresses.getRawValue();
    console.log('emails', emails);
    for (const email of emails) {
      void this.#organisationUsersState.create({email: email.label, role: 'ADMIN'});
    }

    this.activeModal.close();
  }
}
