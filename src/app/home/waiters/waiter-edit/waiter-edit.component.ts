import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import {EntityList, IEntityList, IEntityWithNumberIDAndName} from 'dfx-helper';

import {AbstractModelEditComponent} from '../../../_shared/ui/abstract-model-edit.component';
import {EventModel} from '../../events/_models/event.model';
import {OrganisationModel} from '../../organisations/_models/organisation.model';

import {WaiterModel} from '../_models/waiter.model';
import {EventsService} from '../../events/_services/events.service';
import {OrganisationsService} from '../../organisations/_services/organisations.service';
import {WaiterSessionsService} from '../_services/waiter-sessions.service';

import {WaitersService} from '../_services/waiters.service';
import {WaiterSignInQRCodeModalComponent} from './waiter-sign-in-qr-code-modal.component';

@Component({
  selector: 'app-waiter-edit',
  templateUrl: './waiter-edit.component.html',
  styleUrls: ['./waiter-edit.component.scss'],
})
export class WaiterEditComponent extends AbstractModelEditComponent<WaiterModel> {
  override redirectUrl = '/home/waiters/organisation';
  override onlyEditingTabs = [2];

  selectedOrganisation: OrganisationModel | undefined;
  events: IEntityList<EventModel> = new EntityList();
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
    this.selectedOrganisation = this.organisationsService.getSelected();

    this.unsubscribe(
      this.eventsService.allChange.subscribe((it) => {
        this.events = it;
        if (this.isEditing && this.entity) {
          this.onEntityEdit(this.entity);
        }
      }),
      this.organisationsService.selectedChange.subscribe((it) => (this.selectedOrganisation = it))
    );
  }

  override onEntityCreate(): void {
    if (!this.isEditing) {
      console.log('Adding selected model if selected....');
      this.selectedEvents.add(this.eventsService.getSelected());
      this.unsubscribe(this.eventsService.selectedChange.subscribe((it) => this.selectedEvents.addIfAbsent(it)));
    }
  }

  override onEntityEdit(waiter: WaiterModel): void {
    this.waiterSessionService.setGetAllWaiterId(waiter.id);
    const selected = [];
    for (const event of this.events) {
      if (waiter.events.map((it) => it.id).includes(event.id)) {
        selected.push(event);
      }
    }
    this.selectedEvents.set(selected);
    this.lumber.log('onEntityEdit', 'Mapped waiter events into selectedEvents');
    this.lumber.log('onEntityEdit', 'Waiter events', waiter.events);

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

  formatter = (it: unknown) => (it as IEntityWithNumberIDAndName).name;

  changeSelectedEvents = (selectedEvents: any[]) => (this.selectedEvents = new EntityList(selectedEvents));
}
