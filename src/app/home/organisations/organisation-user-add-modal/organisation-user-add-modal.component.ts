import {Component} from '@angular/core';

import {AComponent, AEntityWithNumberIDAndName, StringHelper} from 'dfx-helper';

import {NotificationService} from '../../../_services/notifications/notification.service';
import {OrganisationsUsersService} from '../../../_services/models/organisations.users.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from 'dfx-translate';

@Component({
  selector: 'app-organisation-user-add-modal',
  templateUrl: './organisation-user-add-modal.component.html',
  styleUrls: ['./organisation-user-add-modal.component.scss'],
})
export class OrganisationUserAddModalComponent extends AComponent {
  entity: AEntityWithNumberIDAndName | undefined;

  active = 1;
  emailAddresses: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
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

  scanSuccess($event: string): void {
    this.emailAddresses.push($event);
    this.active = 1;
  }

  addOrgUser(): void {
    for (const email of this.emailAddresses) {
      this.organisationsUsersService
        ._update({role: 'ADMIN'}, [
          {key: 'uEmail', value: email},
          {key: 'organisationId', value: this.entity?.id},
        ])
        .subscribe(
          (response: any) => {
            console.log(response);
            this.organisationsUsersService.fetchAll();
          },
          (error) => {
            this.notificationService.warning(email + this.translate.translate('HOME_ORGS_USERS_USER_NOT_FOUND'));
            console.log(error);
          }
        );
    }

    this.activeModal.close();
  }
}
