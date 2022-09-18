import {Component} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AComponent, AEntityWithNumberIDAndName, LoggerFactory, StringHelper} from 'dfx-helper';
import {TranslateService} from 'dfx-translate';
import {OrganisationsUsersService} from '../../../_services/models/organisation/organisations-users.service';

import {NotificationService} from '../../../_services/notifications/notification.service';
import {AppQrCodeScannerModalComponent} from '../../../_shared/qr-code-scanner-modal/app-qr-code-scanner-modal.component';

@Component({
  selector: 'app-organisation-user-add-modal',
  templateUrl: './organisation-user-add-modal.component.html',
  styleUrls: ['./organisation-user-add-modal.component.scss'],
})
export class OrganisationUserAddModalComponent extends AComponent {
  entity: AEntityWithNumberIDAndName | undefined;
  emailAddresses: string[] = [];

  private lumber = LoggerFactory.getLogger('OrganisationUserAddModal');

  constructor(
    public activeModal: NgbActiveModal,
    private modal: NgbModal,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private organisationsUsersService: OrganisationsUsersService
  ) {
    super();
  }

  filter = (input: string): boolean => StringHelper.isEmail(input);

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
            this.notificationService.warning(email + this.translate.translate('HOME_ORGS_USERS_USER_NOT_FOUND'));
            console.log(error);
          },
        });
    }

    this.activeModal.close();
  }
}
