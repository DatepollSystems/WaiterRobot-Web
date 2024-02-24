import {AsyncPipe, LowerCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule} from '@angular/forms';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';

import {NotificationService} from '@shared/notifications/notification.service';

import {HasIDAndName, s_isEmail} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr, dfxTranslate$} from 'dfx-translate';
import {OrganisationsUsersService} from '../../_services/organisations-users.service';

@Component({
  template: `
    <div class="modal-header">
      <h3 class="modal-title" id="modal-title-org-user-add">{{ 'USER' | tr }} {{ 'ADD_3' | tr | lowercase }}</h3>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    @if (form.valueChanges | async) {}
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="modal-body">
        <div class="form-group col">
          <label for="emailSelect">{{ 'EMAIL' | tr }}</label>
          <ng-select
            labelForId="emailSelect"
            clearAllText="Clear"
            formControlName="emailAddresses"
            [addTag]="true"
            [multiple]="true"
            [placeholder]="'HOME_ORGS_USERS_EMAIL_PLACEHOLDER' | tr"
            [notFoundText]="'HOME_ORGS_USERS_EMAIL_PLACEHOLDER' | tr"
          />
          @if (form.hasError('emailIsInvalid')) {
            <small class="text-danger">
              {{ 'HOME_USERS_EMAIL_INCORRECT' | tr }}
            </small>
          }
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-success" type="submit" [disabled]="form.invalid">
          {{ 'ADD_3' | tr }}
        </button>
        <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
      </div>
    </form>
  `,
  selector: 'app-organisation-user-add-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTr, LowerCasePipe, BiComponent, NgSelectModule, ReactiveFormsModule, AsyncPipe],
})
export class OrganisationUserAddModalComponent {
  activeModal = inject(NgbActiveModal);
  #notificationService = inject(NotificationService);
  #organisationsUsersService = inject(OrganisationsUsersService);

  entity!: HasIDAndName<number>;

  translate$ = dfxTranslate$();

  form = inject(FormBuilder).nonNullable.group(
    {
      emailAddresses: [new Array<{label: string}>()],
    },
    {validators: this.emailArrayValidator},
  );

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
      this.#organisationsUsersService.create$(this.entity.id, email.label, {role: 'ADMIN'}).subscribe({
        error: () => {
          this.translate$('HOME_ORGS_USERS_USER_NOT_FOUND').subscribe((translation) => {
            this.#notificationService.warning(email.label + translation);
          });
        },
      });
    }

    this.activeModal.close();
  }
}
