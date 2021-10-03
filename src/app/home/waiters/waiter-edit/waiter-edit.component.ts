import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AbstractEntityWithName, EntityList, IList} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';
import {WaitersService} from '../../../_services/waiters.service';
import {EventsService} from '../../../_services/events.service';

import {WaiterQRCodeModal} from '../waiter-qr-code-modal.component';

import {WaiterModel} from '../../../_models/waiter.model';
import {EventModel} from '../../../_models/event.model';
import {OrganisationModel} from '../../../_models/organisation.model';
import {OrganisationsService} from '../../../_services/organisations.service';

@Component({
  selector: 'app-waiter-edit',
  templateUrl: './waiter-edit.component.html',
  styleUrls: ['./waiter-edit.component.scss'],
})
export class WaiterEditComponent extends AbstractModelEditComponent<WaiterModel> {
  override redirectUrl = '/home/waiters/organisation';
  override onlyEditingTabs = [2];

  selectedOrganisation: OrganisationModel | undefined;
  events: IList<EventModel> = new EntityList();
  preSelectedEvents: IList<EventModel> = new EntityList();
  selectedEvents: IList<AbstractEntityWithName<number>> = new EntityList();

  constructor(
    route: ActivatedRoute,
    router: Router,
    waitersService: WaitersService,
    modal: NgbModal,
    private eventsService: EventsService,
    private organisationsService: OrganisationsService
  ) {
    super(route, router, waitersService, modal);

    this.events = this.eventsService.getAll();
    this.autoUnsubscribe(
      this.eventsService.allChange.subscribe((events) => {
        this.events = events.clone();
        this.refreshValues();
      })
    );

    if (!this.isEditing) {
      console.log('Adding selected model if selected....');
      const selected = this.eventsService.getSelected();
      this.preSelectedEvents.addIfAbsent(selected);
      this.selectedEvents.addIfAbsent(selected);
      this.autoUnsubscribe(
        this.eventsService.selectedChange.subscribe((event) => {
          this.preSelectedEvents.addIfAbsent(event);
          this.selectedEvents.addIfAbsent(event);
        })
      );
    }
    this.selectedOrganisation = this.organisationsService.getSelected();
    this.autoUnsubscribe(
      this.organisationsService.selectedChange.subscribe((organisation) => {
        this.selectedOrganisation = organisation;
      })
    );
  }

  override refreshValues() {
    if (!this.events || !this.entity) {
      return;
    }

    for (const event of this.events) {
      if (this.entity.event_ids.includes(event.id)) {
        this.preSelectedEvents.addIfAbsent(event);
      }
    }
  }

  override addCustomAttributesToModel(model: any): any {
    model.organisation_id = this.selectedOrganisation?.id;
    const ids = [];
    for (const event of this.selectedEvents) {
      ids.push(event.id);
    }
    model.event_ids = ids;
    return model;
  }

  onShowQRCode(waiter: WaiterModel) {
    if (this.modal == null) {
      return;
    }
    const modalRef = this.modal.open(WaiterQRCodeModal, {ariaLabelledBy: 'modal-qrcode-title', size: 'lg'});
    modalRef.componentInstance.waiter = waiter;
  }

  changeSelectedEvents(selectedEvents: IList<AbstractEntityWithName<number>>) {
    this.selectedEvents = selectedEvents;
  }
}
