import {AsyncPipe, LowerCasePipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AComponent} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {ChipInput} from '../../../_shared/ui/chip-input/chip-input.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {GetUserResponse, IdAndNameResponse} from '../../../_shared/waiterrobot-backend';
import {OrganisationsService} from '../../organisations/_services/organisations.service';
import {OrganisationsUsersService} from '../../organisations/_services/organisations-users.service';
import {map} from 'rxjs';

@Component({
  template: `
    <div class="modal-header">
      <h3 class="modal-title" id="modal-title-org-user-add">{{ 'NAV_ORGANISATIONS' | tr }} {{ 'ADD_3' | tr | lowercase }}</h3>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="d-flex flex-column">
        <chip-input
          *ngIf="organisations$ | async as organisations"
          (valueChange)="orgUserChange($event)"
          [allModelsToAutoComplete]="organisations"
          [formatter]="formatter"
          [models]="selectedOrganisations"
          validationErrorText="{{ 'INCORRECT_INPUT' | tr }}"
          placeholder="{{ 'HOME_USERS_ORGS_INPUT_PLACEHOLDER' | tr }}"
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
  imports: [ChipInput, DfxTr, LowerCasePipe, AppIconsModule, AsyncPipe, NgIf],
})
export class UserEditOrganisationAddModalComponent extends AComponent {
  entity!: GetUserResponse;
  selectedOrganisations: IdAndNameResponse[] = [];
  preSelectedOrganisations: IdAndNameResponse[] = [];

  organisations$ = inject(OrganisationsService)
    .getAll$()
    .pipe(
      map((it) => {
        it = it.filter((iit) => {
          for (const org of this.preSelectedOrganisations) {
            if (iit.id === org.id) {
              return false;
            }
          }
          return true;
        });
        return it;
      })
    );

  constructor(public activeModal: NgbActiveModal, private modal: NgbModal, private organisationsUsersService: OrganisationsUsersService) {
    super();
  }

  formatter = (it: unknown): string => (it as IdAndNameResponse).name;

  orgUserChange(organisations: IdAndNameResponse[]): void {
    this.selectedOrganisations = organisations;
  }

  addOrgUser(): void {
    for (const organisation of this.selectedOrganisations) {
      this.organisationsUsersService.create$(organisation.id, this.entity.emailAddress, {role: 'ADMIN'}).subscribe();
    }

    this.activeModal.close();
  }
}
