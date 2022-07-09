import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {EntityList, IEntityList, IEntityWithNumberIDAndName} from 'dfx-helper';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';
import {WaiterSignInQRCodeModalComponent} from './waiter-sign-in-qr-code-modal.component';

import {WaitersService} from '../../../_services/models/waiter/waiters.service';
import {EventsService} from '../../../_services/models/events.service';
import {OrganisationsService} from '../../../_services/models/organisation/organisations.service';

import {WaiterModel} from '../../../_models/waiter/waiter.model';
import {EventModel} from '../../../_models/event.model';
import {OrganisationModel} from '../../../_models/organisation/organisation.model';
import {WaiterSessionsService} from '../../../_services/models/waiter/waiter-sessions.service';

@Component({
  selector: 'app-waiter-edit',
  templateUrl: './waiter-edit.component.html',
  styleUrls: ['./waiter-edit.component.scss'],
})
export class WaiterEditComponent extends AbstractModelEditComponent<WaiterModel> {
  override redirectUrl = '/home/waiters/organisation';
  override onlyEditingTabs = [2, 3];

  selectedOrganisation: OrganisationModel | undefined;
  events: IEntityList<EventModel> = new EntityList();
  preSelectedEvents: IEntityList<IEntityWithNumberIDAndName> | undefined = undefined;
  selectedEvents: IEntityList<IEntityWithNumberIDAndName> = new EntityList();

  qrCodeModal: NgbModalRef | undefined;

  constructor(
    route: ActivatedRoute,
    router: Router,
    waitersService: WaitersService,
    modal: NgbModal,
    private waiterSessionService: WaiterSessionsService,
    public eventsService: EventsService,
    private organisationsService: OrganisationsService
  ) {
    super(router, route, modal, waitersService);

    this.events = this.eventsService.getAll();
    this.autoUnsubscribe(
      this.eventsService.allChange.subscribe((models) => {
        this.events = models;
        if (this.isEditing && this.entity) {
          this.onEntityEdit(this.entity);
        }
      })
    );

    this.selectedOrganisation = this.organisationsService.getSelected();
    this.autoUnsubscribe(this.organisationsService.selectedChange.subscribe((organisation) => (this.selectedOrganisation = organisation)));
  }

  override onEntityCreate(): void {
    if (!this.isEditing) {
      console.log('Adding selected model if selected....');
      const selected = this.eventsService.getSelected();
      this.preSelectedEvents = new EntityList(selected);
      this.selectedEvents.add(selected);
      this.autoUnsubscribe(
        this.eventsService.selectedChange.subscribe((event) => {
          this.preSelectedEvents = new EntityList(event);
          this.selectedEvents.addIfAbsent(event);
        })
      );
    }
  }

  override onEntityEdit(waiter: WaiterModel): void {
    this.waiterSessionService.setGetAllWaiterId(waiter.id);
    const selected = [];
    for (const event of this.events) {
      if (waiter.events.includes(event.id)) {
        selected.push(event);
      }
    }
    this.preSelectedEvents = new EntityList(selected);
    this.lumber.log('onEntityEdit', 'Mapped waiter events into selectedEvents', this.preSelectedEvents);

    if (this.qrCodeModal) {
      this.qrCodeModal.componentInstance.token = waiter.signInToken;
    }
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    model.organisationId = this.selectedOrganisation?.id;
    model.eventIds = this.selectedEvents.map((event) => event.id);
    return model;
  }

  onShowQRCode(): void {
    if (!this.modal || !this.entity) {
      return;
    }
    this.modelService.getSingle(this.entity.id);
    this.qrCodeModal = this.modal.open(WaiterSignInQRCodeModalComponent, {
      ariaLabelledBy: 'modal-qrcode-title',
      size: 'lg',
    });
    this.qrCodeModal.componentInstance.name = this.entity.name;
    this.qrCodeModal.componentInstance.token = this.entity.signInToken;
  }

  changeSelectedEvents(selectedEvents: IEntityList<IEntityWithNumberIDAndName>): void {
    this.selectedEvents = selectedEvents;
  }
}
