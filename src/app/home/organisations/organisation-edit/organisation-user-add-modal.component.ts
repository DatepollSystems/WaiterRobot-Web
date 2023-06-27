import {LowerCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AEntityWithNumberIDAndName, s_isEmail} from 'dfts-helper';
import {DfxTr, dfxTranslate$} from 'dfx-translate';

import {NotificationService} from '../../../_shared/notifications/notification.service';
import {ChipInput} from '../../../_shared/ui/chip-input/chip-input.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {OrganisationsUsersService} from '../_services/organisations-users.service';

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
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
    </div>
  `,
  selector: 'app-organisation-user-add-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChipInput, DfxTr, LowerCasePipe, AppIconsModule],
})
export class OrganisationUserAddModalComponent {
  entity!: AEntityWithNumberIDAndName;
  emailAddresses: string[] = [];

  translate$ = dfxTranslate$();

  constructor(
    public activeModal: NgbActiveModal,
    private modal: NgbModal,
    private notificationService: NotificationService,
    private organisationsUsersService: OrganisationsUsersService
  ) {}

  filter = (input: string): boolean => s_isEmail(input);

  orgUserChange(emailAddresses: string[]): void {
    this.emailAddresses = emailAddresses;
  }

  addOrgUser(): void {
    for (const email of this.emailAddresses) {
      this.organisationsUsersService.create$(this.entity.id, email, {role: 'ADMIN'}).subscribe({
        error: () => {
          this.translate$('HOME_ORGS_USERS_USER_NOT_FOUND').subscribe((translation) =>
            this.notificationService.warning(email + translation)
          );
        },
      });
    }

    this.activeModal.close();
  }
}
