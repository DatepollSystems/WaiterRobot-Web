import {Component} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AEntityWithNumberIDAndName, loggerOf, s_isEmail} from 'dfts-helper';

import {AComponent} from 'dfx-helper';
import {dfxTranslate$} from 'dfx-translate';
import {AppQrCodeScannerModalComponent} from '../../../_shared/ui/qr-code/app-qr-code-scanner-modal.component';

import {NotificationService} from '../../../notifications/notification.service';
import {OrganisationsUsersService} from '../_services/organisations-users.service';

@Component({
  selector: 'app-organisation-user-add-modal',
  templateUrl: './organisation-user-add-modal.component.html',
  styleUrls: ['./organisation-user-add-modal.component.scss'],
})
export class OrganisationUserAddModalComponent extends AComponent {
  entity: AEntityWithNumberIDAndName | undefined;
  emailAddresses: string[] = [];

  translate$ = dfxTranslate$();

  private lumber = loggerOf('OrganisationUserAddModal');

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

  openScanModal(): void {
    const modalRef = this.modal.open(AppQrCodeScannerModalComponent, {
      ariaLabelledBy: 'modal-qrcode-scanner-title',
      size: 'lg',
    });
    void modalRef.result.then((result) => {
      if (result && typeof result === 'string') {
        if (!this.filter(result)) {
          this.lumber.warning('scanSuccess', 'Scanned qr code ' + result + 'is no email address');
          return;
        }
        this.emailAddresses.push(result);
      }
    });
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
