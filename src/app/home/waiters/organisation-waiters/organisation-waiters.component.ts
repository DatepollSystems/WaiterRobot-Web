import {Component} from '@angular/core';

import {Converter} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {WaitersService} from '../../../_services/waiters.service';
import {OrganisationsService} from '../../../_services/organisations.service';

import {OrganisationModel} from '../../../_models/organisation.model';
import {WaiterModel} from '../../../_models/waiter.model';

import {WaiterQRCodeModalComponent} from '../waiter-qr-code-modal.component';

@Component({
  selector: 'app-organisation-waiters',
  templateUrl: './organisation-waiters.component.html',
  styleUrls: ['./organisation-waiters.component.scss'],
})
export class OrganisationWaitersComponent extends AbstractModelsListComponent<WaiterModel> {
  selectedOrganisation: OrganisationModel | undefined;

  constructor(protected entitiesService: WaitersService, organisationsService: OrganisationsService, modal: NgbModal) {
    super(entitiesService, modal);

    this.selectedOrganisation = organisationsService.getSelected();
    this.autoUnsubscribe(
      organisationsService.selectedChange.subscribe((org) => {
        this.selectedOrganisation = org;
      })
    );
    this.entitiesService.setSelectedOrganisationGetAllUrl();
  }

  protected override initializeVariables(): void {
    this.entitiesService.setSelectedOrganisationGetAllUrl();
    super.initializeVariables();
  }

  protected override checkFilterForModel(filter: string, model: WaiterModel): WaiterModel | undefined {
    if (Converter.numberToString(model.id) === filter || model.name.trim().toLowerCase().includes(filter)) {
      return model;
    }
    return undefined;
  }

  public openQRCode(waiter: WaiterModel): void {
    const modalRef = this.modal.open(WaiterQRCodeModalComponent, {ariaLabelledBy: 'modal-qrcode-title', size: 'lg'});
    modalRef.componentInstance.waiter = waiter;
  }
}
