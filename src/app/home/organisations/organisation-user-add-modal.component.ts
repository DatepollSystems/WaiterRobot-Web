import {LowerCasePipe} from '@angular/common';
import {Component} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AEntityWithNumberIDAndName, s_isEmail} from 'dfts-helper';

import {AComponent} from 'dfx-helper';
import {DfxTr, dfxTranslate$} from 'dfx-translate';
import {ChipInput} from '../../_shared/ui/chip-input/chip-input.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';

import {NotificationService} from '../../notifications/notification.service';
import {OrganisationsUsersService} from './_services/organisations-users.service';

@Component({
  template: `
    <div class="modal-header">
      <h3 class="modal-title" id="modal-title-org-user-add">{{ 'USER' | tr }} {{ 'ADD_3' | tr | lowercase }}</h3>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="d-flex flex-column">
        <chip-input
          (valueChange)="orgUserChange($event)"
          [validator]="filter"
          [models]="emailAddresses"
          validationErrorText="{{ 'HOME_USERS_EMAIL_INCORRECT' | tr }}"
          placeholder="{{ 'HOME_ORGS_USERS_EMAIL_PLACEHOLDER' | tr }}"
        />
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-success" type="button" (click)="addOrgUser()">
        {{ 'ADD_3' | tr }}
      </button>
      <button type="button" class="btn btn-outline-secondary" ngbAutofocus (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
    </div>
  `,
  selector: 'app-organisation-user-add-modal',
  standalone: true,
  imports: [ChipInput, DfxTr, LowerCasePipe, AppIconsModule],
})
export class OrganisationUserAddModalComponent extends AComponent {
  entity: AEntityWithNumberIDAndName | undefined;
  emailAddresses: string[] = [];

  translate$ = dfxTranslate$();

  constructor(
    public activeModal: NgbActiveModal,
    private modal: NgbModal,
    private notificationService: NotificationService,
    private organisationsUsersService: OrganisationsUsersService
  ) {
    super();
  }

  filter = (input: string): boolean => s_isEmail(input);

  orgUserChange(emailAddresses: string[]): void {
    this.emailAddresses = emailAddresses;
  }

  addOrgUser(): void {
    for (const email of this.emailAddresses) {
      this.organisationsUsersService
        ._update({role: 'ADMIN'}, [
          {key: 'uEmail', value: email},
          {key: 'organisationId', value: this.entity?.id},
        ])
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.organisationsUsersService.fetchAll();
          },
          error: (error) => {
            this.translate$('HOME_ORGS_USERS_USER_NOT_FOUND').subscribe((translation) =>
              this.notificationService.warning(email + translation)
            );
            console.log(error);
          },
        });
    }

    this.activeModal.close();
  }
}
