import {NgIf} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbModalRef, NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {EntityList, IEntityList, IEntityWithNumberIDAndName} from 'dfts-helper';
import {DfxTr} from 'dfx-translate';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {ChipInput} from '../../../_shared/ui/chip-input/chip-input.component';

import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppBtnModelEditConfirmComponent} from '../../../_shared/ui/form/app-btn-model-edit-confirm.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {EventModel} from '../../events/_models/event.model';
import {EventsService} from '../../events/_services/events.service';
import {OrganisationModel} from '../../organisations/_models/organisation.model';
import {OrganisationsService} from '../../organisations/_services/organisations.service';

import {WaiterModel} from '../_models/waiter.model';
import {WaiterSessionsService} from '../_services/waiter-sessions.service';

import {WaitersService} from '../_services/waiters.service';
import {BtnWaiterSignInQrCodeComponent} from './btn-waiter-sign-in-qr-code.component';
import {WaiterSessionsComponent} from './waiter-sessions.component';

@Component({
  template: `
    <div [hidden]="isEditing && !entityLoaded">
      <h1 *ngIf="isEditing && entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
      <h1 *ngIf="!isEditing">{{ 'ADD_2' | tr }}</h1>

      <btn-toolbar>
        <div>
          <button class="btn btn-sm btn-dark text-white" (click)="onGoBack()">{{ 'GO_BACK' | tr }}</button>
        </div>

        <app-btn-model-edit-confirm [form]="f" [editing]="isEditing"></app-btn-model-edit-confirm>

        <ng-container *ngIf="isEditing && entity">
          <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
            <i-bs name="trash"></i-bs>
            {{ 'DELETE' | tr }}
          </button>

          <app-btn-waiter-signin-qrcode [token]="entity.signInToken"></app-btn-waiter-signin-qrcode>
        </ng-container>
      </btn-toolbar>

      <form id="ngForm" #f="ngForm" (ngSubmit)="onSave(f)">
        <ul ngbNav #nav="ngbNav" [(activeId)]="activeTab" class="nav-tabs bg-dark" (navChange)="setTabId($event.nextId)">
          <li [ngbNavItem]="1">
            <a ngbNavLink>{{ 'DATA' | tr }}</a>
            <ng-template ngbNavContent>
              <div class="row g-3">
                <div class="form-group col-sm-12 col-md-4 col-lg-5 col-xl-6">
                  <label for="name">{{ 'NAME' | tr }}</label>
                  <input
                    ngModel
                    class="form-control bg-dark text-white"
                    required
                    type="text"
                    id="name"
                    name="name"
                    #nameModel="ngModel"
                    minlength="3"
                    maxlength="70"
                    placeholder="{{ 'NAME' | tr }}"
                    [ngModel]="isEditing ? entity?.name : null" />

                  <small *ngIf="nameModel.invalid" class="text-danger">
                    {{ 'HOME_WAITERS_EDIT_NAME_INCORRECT' | tr }}
                  </small>
                </div>

                <chip-input
                  class="col-sm-12 col-md-8 col-lg-7 col-xl-6"
                  placeholder="{{ 'HOME_WAITERS_EDIT_EVENTS_PLACEHOLDER' | tr }}"
                  label="{{ 'HOME_WAITERS_EDIT_EVENTS' | tr }}"
                  editable="false"
                  [models]="selectedEvents"
                  [allModelsToAutoComplete]="events"
                  [formatter]="formatter"
                  (valueChange)="changeSelectedEvents($event)">
                </chip-input>
              </div>

              <div class="d-flex flex-column flex-md-row gap-2 gap-md-4 mt-2">
                <div class="form-check">
                  <input
                    ngModel
                    class="form-check-input"
                    type="checkbox"
                    id="activated"
                    [ngModel]="isEditing ? entity?.activated : null"
                    name="activated" />
                  <label class="form-check-label" for="activated">
                    {{ 'HOME_USERS_ACTIVATED' | tr }}
                  </label>
                </div>
              </div>
            </ng-template>
          </li>
          <li [ngbNavItem]="2" *ngIf="isEditing && entity" [destroyOnHide]="true">
            <a ngbNavLink>{{ 'NAV_USER_SESSIONS' | tr }}</a>
            <ng-template ngbNavContent>
              <app-waiter-sessions></app-waiter-sessions>
            </ng-template>
          </li>
        </ul>

        <div [ngbNavOutlet]="nav" class="mt-2 bg-dark"></div>
      </form>
    </div>

    <app-spinner-row [show]="isEditing && !entityLoaded"></app-spinner-row>
  `,
  selector: 'app-waiter-edit',
  imports: [
    NgIf,
    DfxTr,
    AppBtnModelEditConfirmComponent,
    AppBtnToolbarComponent,
    AppIconsModule,
    BtnWaiterSignInQrCodeComponent,
    FormsModule,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavContent,
    ChipInput,
    AppSpinnerRowComponent,
    NgbNavOutlet,
    WaiterSessionsComponent,
  ],
  standalone: true,
})
export class WaiterEditComponent extends AbstractModelEditComponent<WaiterModel> {
  override redirectUrl = '/home/waiters/organisation';
  override onlyEditingTabs = [2];

  selectedOrganisation: OrganisationModel | undefined;
  events: IEntityList<EventModel> = new EntityList();
  selectedEvents: IEntityList<IEntityWithNumberIDAndName> = new EntityList();

  qrCodeModal: NgbModalRef | undefined;

  constructor(
    waitersService: WaitersService,
    private waiterSessionService: WaiterSessionsService,
    public eventsService: EventsService,
    private organisationsService: OrganisationsService
  ) {
    super(waitersService);

    this.events = this.eventsService.getAll();
    this.selectedOrganisation = this.organisationsService.getSelected();

    this.unsubscribe(
      this.eventsService.allChange.subscribe((it) => {
        this.events = it;
        if (this.isEditing && this.entity) {
          this.onEntityEdit(this.entity);
        }
      }),
      this.organisationsService.getSelected$.subscribe((it) => (this.selectedOrganisation = it))
    );
  }

  override onEntityCreate(): void {
    if (!this.isEditing) {
      console.log('Adding selected model if selected....');
      this.selectedEvents.add(this.eventsService.getSelected());
      this.unsubscribe(this.eventsService.getSelected$.subscribe((it) => this.selectedEvents.addIfAbsent(it)));
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

  formatter = (it: unknown): string => (it as IEntityWithNumberIDAndName).name;

  changeSelectedEvents = (selectedEvents: any[]): void => {
    this.selectedEvents = new EntityList(selectedEvents);
  };
}
