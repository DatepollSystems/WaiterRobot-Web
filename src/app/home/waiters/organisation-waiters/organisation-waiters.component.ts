import {Component} from '@angular/core';
import {Subscription} from 'rxjs';
import {Converter} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {WaitersService} from '../../../_services/waiters.service';
import {OrganisationsService} from '../../../_services/organisations.service';
import {OrganisationModel} from '../../../_models/organisation.model';
import {WaiterModel} from '../../../_models/waiter.model';

import {AModelsListComponent} from '../../../_helper/a-models-list.component';
import {QRCodeModal} from '../waiters.component';

@Component({
  selector: 'app-organisation-waiters',
  templateUrl: './organisation-waiters.component.html',
  styleUrls: ['./organisation-waiters.component.scss']
})
export class OrganisationWaitersComponent extends AModelsListComponent<WaiterModel> {
  selectedOrganisation: OrganisationModel | undefined;
  selectedOrganisationSubscription: Subscription;

  constructor(private waitersService: WaitersService,
              private organisationService: OrganisationsService,
              private modalService: NgbModal) {
    super(waitersService);

    this.selectedOrganisation = this.organisationService.getSelected();
    this.initializeVariables();
    this.selectedOrganisationSubscription = this.organisationService.selectedChange.subscribe(value => {
      this.selectedOrganisation = value;
      this.initializeVariables();
    });
  }

  protected override initializeVariables() {
    if (!this.selectedOrganisation) {
      return;
    }
    this.waitersService.setGetAllUrl('/config/waiter?organisation_id=' + this.selectedOrganisation.id);
    super.initializeVariables();
  }

  protected override checkFilterForModel(filter: string, model: WaiterModel): WaiterModel | undefined {
    if (Converter.numberToString(model.id) === filter
      || model.name.trim().toLowerCase().includes(filter)) {
      return model;
    }
    return undefined;
  }

  public openQRCode(waiter: WaiterModel) {
    const modalRef = this.modalService.open(QRCodeModal, {ariaLabelledBy: 'modal-qrcode-title', size: 'lg' });
    modalRef.componentInstance.waiter = waiter;
  }
}
