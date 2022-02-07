import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AEntityWithName, AEntityWithNumberIDAndName, EntityList, IList} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';
import {WaiterSignInQRCodeModalComponent} from './waiter-sign-in-qr-code-modal.component';

import {WaitersService} from '../../../_services/models/waiters.service';
import {EventsService} from '../../../_services/models/events.service';
import {OrganisationsService} from '../../../_services/models/organisations.service';

import {WaiterModel} from '../../../_models/waiter.model';
import {EventModel} from '../../../_models/event.model';
import {OrganisationModel} from '../../../_models/organisation.model';

@Component({
  selector: 'app-waiter-edit',
  templateUrl: './waiter-edit.component.html',
  styleUrls: ['./waiter-edit.component.scss'],
})
export class WaiterEditComponent extends AbstractModelEditComponent<WaiterModel> {
  override redirectUrl = '/home/waiters/organisation';
  override onlyEditingTabs = [2];

  selectedOrganisation: OrganisationModel | undefined;
  events: IList<EventModel>;
  selectedEvents: IList<AEntityWithNumberIDAndName> = new EntityList();

  constructor(
    route: ActivatedRoute,
    router: Router,
    waitersService: WaitersService,
    modal: NgbModal,
    public eventsService: EventsService,
    private organisationsService: OrganisationsService
  ) {
    super(router, route, modal, waitersService);

    this.events = this.eventsService.getAll();
    this.autoUnsubscribe(
      this.eventsService.allChange.subscribe((models) => {
        this.events.set(models.clone());
      })
    );

    this.selectedOrganisation = this.organisationsService.getSelected();
    this.autoUnsubscribe(
      this.organisationsService.selectedChange.subscribe((organisation) => {
        this.selectedOrganisation = organisation;
      })
    );
  }

  override onModelCreate() {
    if (!this.isEditing) {
      console.log('Adding selected model if selected....');
      const selected = this.eventsService.getSelected();
      this.selectedEvents.removeAll();
      this.selectedEvents.add(selected);
      this.autoUnsubscribe(
        this.eventsService.selectedChange.subscribe((event) => {
          this.selectedEvents.removeAll();
          this.selectedEvents.add(event);
        })
      );
    }
  }

  override onModelEdit(model: WaiterModel): void {
    if (!this.events) {
      return;
    }

    this.selectedEvents.removeAll();
    for (const event of this.events) {
      if (model.events.includes(event.id)) {
        this.selectedEvents.add(event);
      }
    }
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    model.organisation_id = this.selectedOrganisation?.id;
    const ids = [];
    for (const event of this.selectedEvents) {
      ids.push(event.id);
    }
    model.event_ids = ids;
    return model;
  }

  onShowQRCode(waiter: WaiterModel): void {
    if (this.modal == null) {
      return;
    }
    const modalRef = this.modal.open(WaiterSignInQRCodeModalComponent, {
      ariaLabelledBy: 'modal-qrcode-title',
      size: 'lg',
    });
    modalRef.componentInstance.name = waiter.name;
    modalRef.componentInstance.token = waiter.signInToken;
  }

  changeSelectedEvents(selectedEvents: IList<AEntityWithName<number>>): void {
    this.selectedEvents = selectedEvents;
  }
}
