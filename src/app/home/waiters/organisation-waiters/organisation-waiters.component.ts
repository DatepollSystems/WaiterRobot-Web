import {Component} from '@angular/core';
import {Subscription} from 'rxjs';
import {Converter} from 'dfx-helper';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelsListComponent} from '../../../_helper/abstract-models-list.component';
import {WaitersService} from '../../../_services/waiters.service';
import {OrganisationsService} from '../../../_services/organisations.service';

import {OrganisationModel} from '../../../_models/organisation.model';
import {WaiterModel} from '../../../_models/waiter.model';

import {WaiterQRCodeModal} from '../waiter-qr-code-modal.component';

@Component({
  selector: 'app-organisation-waiters',
  templateUrl: './organisation-waiters.component.html',
  styleUrls: ['./organisation-waiters.component.scss'],
})
export class OrganisationWaitersComponent extends AbstractModelsListComponent<WaiterModel> {
  selectedOrganisation: OrganisationModel | undefined;
  selectedOrganisationSubscription: Subscription;

  constructor(private waitersService: WaitersService, private organisationsService: OrganisationsService, modal: NgbModal) {
    super(waitersService, modal);

    this.selectedOrganisation = this.organisationsService.getSelected();
    this.initializeVariables();
    this.selectedOrganisationSubscription = this.organisationsService.selectedChange.subscribe((value) => {
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
    if (Converter.numberToString(model.id) === filter || model.name.trim().toLowerCase().includes(filter)) {
      return model;
    }
    return undefined;
  }

  public openQRCode(waiter: WaiterModel) {
    const modalRef = this.modal.open(WaiterQRCodeModal, {ariaLabelledBy: 'modal-qrcode-title', size: 'lg'});
    modalRef.componentInstance.waiter = waiter;
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    // TODO: this.waitersService.flushAll();
    this.selectedOrganisationSubscription.unsubscribe();
  }
}
